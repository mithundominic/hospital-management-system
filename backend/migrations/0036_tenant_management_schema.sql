-- Migration: 0036_tenant_management_schema.sql
-- Responsibility: Add tenant management capabilities for multi-hospital platform administration
-- Enables SuperAdmin/Support roles to manage hospital lifecycle, branding, BAA documents, and isolation audits

-- ============================================================================
-- 1. Extend hospitals table with lifecycle and preference fields
-- ============================================================================

ALTER TABLE hospitals 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
    CHECK (status IN ('active', 'suspended', 'archived')),
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-US',
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

COMMENT ON COLUMN hospitals.status IS 'Hospital account status: active, suspended (billing/compliance), or archived';
COMMENT ON COLUMN hospitals.suspension_reason IS 'Reason for suspension (e.g., billing issues, compliance violations)';
COMMENT ON COLUMN hospitals.timezone IS 'Hospital timezone for scheduling and reporting';
COMMENT ON COLUMN hospitals.locale IS 'Locale for date/number formatting and translations';
COMMENT ON COLUMN hospitals.currency IS 'Default currency for billing';

-- ============================================================================
-- 2. Hospital lifecycle events (insert-only audit ledger)
-- ============================================================================

CREATE TABLE IF NOT EXISTS hospital_lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'activated', 'suspended', 'reactivated', 'archived', 'deleted')),
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lifecycle_events_hospital ON hospital_lifecycle_events(hospital_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lifecycle_events_type ON hospital_lifecycle_events(event_type);

COMMENT ON TABLE hospital_lifecycle_events IS 'Insert-only audit ledger of hospital status changes';

ALTER TABLE hospital_lifecycle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view all lifecycle events"
  ON hospital_lifecycle_events FOR SELECT
  USING (
    is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name IN ('SuperAdmin', 'Support')
    )
  );

CREATE POLICY "Platform admins can insert lifecycle events"
  ON hospital_lifecycle_events FOR INSERT
  WITH CHECK (
    is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name = 'SuperAdmin'
    )
  );

-- ============================================================================
-- 3. Hospital branding
-- ============================================================================

CREATE TABLE IF NOT EXISTS hospital_branding (
  hospital_id UUID PRIMARY KEY REFERENCES hospitals(id) ON DELETE CASCADE,
  logo_url TEXT,
  color_scheme JSONB DEFAULT '{"primary": "#3b82f6", "secondary": "#8b5cf6", "accent": "#10b981"}',
  custom_domain TEXT UNIQUE,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE hospital_branding IS 'Hospital branding configuration (logo, colors, custom domain)';
COMMENT ON COLUMN hospital_branding.color_scheme IS 'JSON object with primary, secondary, accent color hex codes';

ALTER TABLE hospital_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospital admins and platform admins can view branding"
  ON hospital_branding FOR SELECT
  USING (
    hospital_id IN (
      SELECT hospital_id FROM memberships WHERE user_id = auth.uid()
    )
    OR is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name IN ('SuperAdmin', 'Support')
    )
  );

CREATE POLICY "Hospital admins and platform admins can update branding"
  ON hospital_branding FOR ALL
  USING (
    hospital_id IN (
      SELECT m.hospital_id FROM memberships m
      JOIN role_permissions rp ON m.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE m.user_id = auth.uid()
        AND p.key = 'hospitals.update'
    )
    OR is_platform_admin(auth.uid())
  );

-- ============================================================================
-- 4. Hospital BAA documents
-- ============================================================================

CREATE TABLE IF NOT EXISTS hospital_baa_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_baa_hospital ON hospital_baa_documents(hospital_id);
CREATE INDEX IF NOT EXISTS idx_baa_expiry ON hospital_baa_documents(expires_at) WHERE expires_at IS NOT NULL;

COMMENT ON TABLE hospital_baa_documents IS 'Business Associate Agreement documents for HIPAA compliance';

ALTER TABLE hospital_baa_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospital admins and platform admins can view BAA documents"
  ON hospital_baa_documents FOR SELECT
  USING (
    hospital_id IN (
      SELECT hospital_id FROM memberships WHERE user_id = auth.uid()
    )
    OR is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name IN ('SuperAdmin', 'Support')
    )
  );

CREATE POLICY "Platform admins can manage all BAA documents"
  ON hospital_baa_documents FOR ALL
  USING (
    is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name = 'SuperAdmin'
    )
  );

-- ============================================================================
-- 5. Tenant isolation audits (insert-only ledger)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_isolation_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_type TEXT NOT NULL CHECK (audit_type IN ('data_leak_check', 'rls_verification', 'cross_tenant_query')),
  findings JSONB DEFAULT '{}',
  audited_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  audited_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_isolation_audits_type ON tenant_isolation_audits(audit_type, audited_at DESC);

COMMENT ON TABLE tenant_isolation_audits IS 'Insert-only audit ledger for tenant isolation verification';

ALTER TABLE tenant_isolation_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view isolation audits"
  ON tenant_isolation_audits FOR SELECT
  USING (
    is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name IN ('SuperAdmin', 'Support')
    )
  );

CREATE POLICY "Platform admins can insert isolation audits"
  ON tenant_isolation_audits FOR INSERT
  WITH CHECK (
    is_platform_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
        AND r.name = 'SuperAdmin'
    )
  );

-- ============================================================================
-- 6. Add platform-level permissions
-- ============================================================================

INSERT INTO permissions (key, description) VALUES
  ('tenants.read', 'View all hospital tenants and their configurations'),
  ('tenants.create', 'Create new hospital tenants'),
  ('tenants.update', 'Update hospital tenant settings and preferences'),
  ('tenants.suspend', 'Suspend hospital tenants'),
  ('tenants.delete', 'Archive or delete hospital tenants'),
  ('tenants.export', 'Export hospital data for migration'),
  ('tenants.clone', 'Clone hospital configurations for franchises')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 7. Grant permissions to platform roles
-- ============================================================================

-- SuperAdmin gets all tenant permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'SuperAdmin'
  AND p.key LIKE 'tenants.%'
ON CONFLICT DO NOTHING;

-- Support gets read-only access
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Support'
  AND p.key = 'tenants.read'
ON CONFLICT DO NOTHING;
