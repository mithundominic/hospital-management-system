-- Migration: 0037_enterprise_tenant_hierarchy.sql
-- Responsibility: Introduce 2-Tier Multi-Tenant Hierarchy (Organizations -> Facilities)
-- Establishes legal organization boundary while preserving all existing facility foreign keys.

-- ============================================================================
-- 1. CREATE ORGANIZATIONS TABLE (Tier 1 Boundary)
-- ============================================================================

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
    subscription_tier TEXT NOT NULL DEFAULT 'standard' CHECK (subscription_tier IN ('starter', 'standard', 'enterprise')),
    max_facilities INTEGER NOT NULL DEFAULT 5,
    billing_email TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE organizations IS 'Legal tenant entity and subscription boundary for healthcare networks';

-- ============================================================================
-- 2. CREATE TENANT_MEMBERSHIPS TABLE (Organization User Scope)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, tenant_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_memberships_user ON tenant_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_memberships_tenant ON tenant_memberships(tenant_id);

COMMENT ON TABLE tenant_memberships IS 'User memberships at the organization tier (OrgAdmin, OrgBillingManager, OrgAuditor)';

-- ============================================================================
-- 3. EXTEND HOSPITALS TABLE (Tier 2 Link)
-- ============================================================================

ALTER TABLE hospitals 
    ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES organizations(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS code TEXT,
    ADD COLUMN IF NOT EXISTS facility_type TEXT NOT NULL DEFAULT 'hospital' 
        CHECK (facility_type IN ('hospital', 'clinic', 'diagnostic_center', 'pharmacy_store', 'central_warehouse'));

CREATE INDEX IF NOT EXISTS idx_hospitals_tenant_id ON hospitals(tenant_id);

-- ============================================================================
-- 4. SEED ORGANIZATION ROLES & PERMISSIONS
-- ============================================================================

INSERT INTO roles (name, scope, description) VALUES
    ('OrgAdmin', 'organization', 'Enterprise administrator with cross-facility operational authority'),
    ('OrgBillingManager', 'organization', 'Corporate billing and financial manager across all facilities'),
    ('OrgAuditor', 'organization', 'Read-only compliance and clinical auditor for network facilities')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (key, description) VALUES
    ('org.read', 'View organization details and facility directory'),
    ('org.write', 'Modify organization settings and branding defaults'),
    ('org.facilities.create', 'Provision new hospital facilities within plan quota'),
    ('org.billing.manage', 'Manage enterprise subscription, corporate TPAs, and consolidated invoices'),
    ('org.reports.read', 'Access cross-facility consolidated executive analytics'),
    ('org.staff.manage', 'Manage organization-level administrators and credentials')
ON CONFLICT (key) DO NOTHING;

-- Map permissions to OrgAdmin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'OrgAdmin'
  AND p.key IN (
    'org.read', 'org.write', 'org.facilities.create', 
    'org.billing.manage', 'org.reports.read', 'org.staff.manage',
    'patients.read', 'appointments.read', 'encounters.read',
    'beds.read', 'inventory.read', 'billing.read', 'reports.read',
    'hospital.manage', 'departments.read', 'departments.write',
    'doctors.read', 'doctors.write', 'shifts.read', 'attendance.read'
  )
ON CONFLICT DO NOTHING;

-- Map permissions to OrgBillingManager
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'OrgBillingManager'
  AND p.key IN (
    'org.read', 'org.billing.manage', 'billing.read', 
    'billing.write', 'org.reports.read', 'reports.read'
  )
ON CONFLICT DO NOTHING;

-- Map permissions to OrgAuditor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'OrgAuditor'
  AND p.key IN (
    'org.read', 'org.reports.read', 'patients.read', 
    'billing.read', 'reports.read', 'encounters.read', 'shifts.read'
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. BACKFILL EXISTING STANDALONE HOSPITALS 1:1 INTO ORGANIZATIONS
-- ============================================================================

DO $$
DECLARE
    h_rec RECORD;
    new_org_id UUID;
    v_slug TEXT;
    v_counter INT;
    v_test_slug TEXT;
BEGIN
    FOR h_rec IN SELECT * FROM hospitals WHERE tenant_id IS NULL ORDER BY created_at ASC LOOP
        -- Build clean unique slug
        v_slug := lower(regexp_replace(h_rec.name, '[^a-zA-Z0-9]+', '-', 'g'));
        v_slug := trim(both '-' from v_slug);
        IF length(v_slug) = 0 THEN
            v_slug := 'hospital';
        END IF;

        v_test_slug := v_slug;
        v_counter := 1;
        WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = v_test_slug) LOOP
            v_counter := v_counter + 1;
            v_test_slug := v_slug || '-' || v_counter;
        END LOOP;

        INSERT INTO organizations (
            name,
            slug,
            status,
            subscription_tier,
            max_facilities,
            billing_email,
            currency,
            timezone,
            created_at,
            updated_at
        )
        VALUES (
            h_rec.name,
            v_test_slug,
            coalesce(h_rec.status, 'active'),
            'standard',
            5,
            coalesce(h_rec.email, 'admin@' || v_test_slug || '.local'),
            coalesce(h_rec.currency, 'INR'),
            coalesce(h_rec.timezone, 'Asia/Kolkata'),
            h_rec.created_at,
            h_rec.updated_at
        )
        RETURNING id INTO new_org_id;

        -- Link hospital to newly created organization
        UPDATE hospitals 
        SET tenant_id = new_org_id,
            code = coalesce(h_rec.code, 'MAIN-' || substr(h_rec.id::text, 1, 4))
        WHERE id = h_rec.id;

        -- Promote existing HospitalAdmins to OrgAdmin at the organization level
        INSERT INTO tenant_memberships (user_id, tenant_id, role_id, status)
        SELECT DISTINCT m.user_id, new_org_id, r_org.id, 'active'
        FROM memberships m
        JOIN roles r_hosp ON m.role_id = r_hosp.id AND r_hosp.name = 'HospitalAdmin'
        CROSS JOIN roles r_org
        WHERE r_org.name = 'OrgAdmin'
          AND m.hospital_id = h_rec.id
        ON CONFLICT (user_id, tenant_id, role_id) DO NOTHING;

    END LOOP;
END $$;

-- Enforce NOT NULL on tenant_id now that every hospital has a parent organization
ALTER TABLE hospitals ALTER COLUMN tenant_id SET NOT NULL;

-- ============================================================================
-- 6. ENABLE ROW LEVEL SECURITY & DEFINE POLICIES ON ORGANIZATIONS & TENANT_MEMBERSHIPS
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;

-- Helper functions for non-recursive RLS checks
CREATE OR REPLACE FUNCTION is_org_member(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_memberships
    WHERE tenant_id = p_org_id
      AND user_id = p_user_id
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION has_org_permission(p_org_id UUID, p_user_id UUID, p_permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_memberships tm
    JOIN role_permissions rp ON rp.role_id = tm.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE tm.tenant_id = p_org_id
      AND tm.user_id = p_user_id
      AND tm.status = 'active'
      AND p.key = p_permission
  );
$$;

-- Drop any existing policies if they exist before creating
DROP POLICY IF EXISTS "organizations_select_member_or_platform" ON organizations;
DROP POLICY IF EXISTS "organizations_update_admin" ON organizations;
DROP POLICY IF EXISTS "tenant_memberships_select_own_or_admin" ON tenant_memberships;
DROP POLICY IF EXISTS "tenant_memberships_manage_admin" ON tenant_memberships;
DROP POLICY IF EXISTS "tenant_memberships_update_admin" ON tenant_memberships;
DROP POLICY IF EXISTS "tenant_memberships_delete_admin" ON tenant_memberships;

-- Policies for organizations
CREATE POLICY "organizations_select_member_or_platform"
    ON organizations FOR SELECT
    USING (
        is_org_member(id, auth.uid())
        OR is_platform_admin(auth.uid())
    );

CREATE POLICY "organizations_update_admin"
    ON organizations FOR UPDATE
    USING (
        has_org_permission(id, auth.uid(), 'org.write')
        OR is_platform_admin(auth.uid())
    );

-- Policies for tenant_memberships
CREATE POLICY "tenant_memberships_select_own_or_admin"
    ON tenant_memberships FOR SELECT
    USING (
        user_id = auth.uid()
        OR is_org_member(tenant_id, auth.uid())
        OR is_platform_admin(auth.uid())
    );

CREATE POLICY "tenant_memberships_manage_admin"
    ON tenant_memberships FOR INSERT
    WITH CHECK (
        has_org_permission(tenant_id, auth.uid(), 'org.staff.manage')
        OR is_platform_admin(auth.uid())
    );

CREATE POLICY "tenant_memberships_update_admin"
    ON tenant_memberships FOR UPDATE
    USING (
        has_org_permission(tenant_id, auth.uid(), 'org.staff.manage')
        OR is_platform_admin(auth.uid())
    );

CREATE POLICY "tenant_memberships_delete_admin"
    ON tenant_memberships FOR DELETE
    USING (
        has_org_permission(tenant_id, auth.uid(), 'org.staff.manage')
        OR is_platform_admin(auth.uid())
    );

-- ============================================================================
-- 7. UPGRADE UNIVERSAL RBAC RESOLVER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION rbac_effective_hospital_permission(
    p_user_id UUID,
    p_hospital_id UUID,
    p_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- 1. Direct Facility Membership (Fast index scan)
  SELECT EXISTS (
    SELECT 1
    FROM memberships m
    JOIN role_permissions rp ON rp.role_id = m.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE m.user_id = p_user_id
      AND m.hospital_id = p_hospital_id
      AND m.status = 'active'
      AND p.key = p_permission
  )
  OR
  -- 2. Organization Administrator Inheritance (Operational Only)
  -- Clinical write permissions are blocked from OrgAdmin at DB level
  (
    p_permission NOT IN (
      'encounters.write', 'prescriptions.write', 
      'lab_orders.write', 'lab_results.write'
    )
    AND EXISTS (
      SELECT 1
      FROM hospitals h
      JOIN tenant_memberships tm ON tm.tenant_id = h.tenant_id
      JOIN role_permissions rp ON rp.role_id = tm.role_id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE h.id = p_hospital_id
        AND tm.user_id = p_user_id
        AND tm.status = 'active'
        AND p.key = p_permission
    )
  );
$$;

-- ============================================================================
-- 8. SELF-SERVICE ONBOARDING RPC: register_tenant_and_facility
-- ============================================================================

CREATE OR REPLACE FUNCTION register_tenant_and_facility(
    p_user_id UUID,
    p_org_name TEXT,
    p_facility_name TEXT,
    p_facility_registration TEXT,
    p_address TEXT,
    p_city TEXT,
    p_state TEXT,
    p_pincode TEXT,
    p_billing_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_org_id UUID;
    v_hospital_id UUID;
    v_org_role_id UUID;
    v_hosp_role_id UUID;
    v_slug TEXT;
    v_counter INT := 1;
    v_test_slug TEXT;
BEGIN
    -- Derive unique slug
    v_slug := lower(regexp_replace(p_org_name, '[^a-zA-Z0-9]+', '-', 'g'));
    v_slug := trim(both '-' from v_slug);
    IF length(v_slug) = 0 THEN
        v_slug := 'org';
    END IF;
    
    v_test_slug := v_slug;
    WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = v_test_slug) LOOP
        v_counter := v_counter + 1;
        v_test_slug := v_slug || '-' || v_counter;
    END LOOP;

    -- 1. Create Organization
    INSERT INTO organizations (
        name,
        slug,
        status,
        subscription_tier,
        max_facilities,
        billing_email
    )
    VALUES (
        p_org_name,
        v_test_slug,
        'active',
        'standard',
        5,
        p_billing_email
    )
    RETURNING id INTO v_org_id;

    -- 2. Create Primary Hospital Facility
    INSERT INTO hospitals (
        tenant_id,
        name,
        code,
        registration_number,
        address,
        city,
        state,
        pincode,
        is_active,
        status,
        email
    )
    VALUES (
        v_org_id,
        p_facility_name,
        'MAIN-01',
        p_facility_registration,
        p_address,
        p_city,
        p_state,
        p_pincode,
        true,
        'active',
        p_billing_email
    )
    RETURNING id INTO v_hospital_id;

    -- Lookup roles
    SELECT id INTO v_org_role_id FROM roles WHERE name = 'OrgAdmin';
    SELECT id INTO v_hosp_role_id FROM roles WHERE name = 'HospitalAdmin';

    -- 3. Bind user as OrgAdmin at organization tier
    INSERT INTO tenant_memberships (user_id, tenant_id, role_id, status)
    VALUES (p_user_id, v_org_id, v_org_role_id, 'active');

    -- 4. Bind user as HospitalAdmin at facility tier
    INSERT INTO memberships (user_id, hospital_id, role_id, status)
    VALUES (p_user_id, v_hospital_id, v_hosp_role_id, 'active');

    -- 5. Seed default departments for the primary facility
    INSERT INTO departments (hospital_id, name) VALUES
        (v_hospital_id, 'General Medicine'),
        (v_hospital_id, 'Emergency'),
        (v_hospital_id, 'Outpatient Department'),
        (v_hospital_id, 'Pharmacy');

    RETURN jsonb_build_object(
        'organization_id', v_org_id,
        'hospital_id', v_hospital_id,
        'slug', v_test_slug,
        'status', 'active'
    );
END;
$$;
