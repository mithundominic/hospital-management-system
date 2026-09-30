-- Migration 0022: Fix Missing RLS Policies
-- Adds INSERT/UPDATE/DELETE policies for patient_registrations, doctor_profiles, and departments
-- These tables currently have SELECT-only policies, blocking POST/PATCH operations

-- ============================================================================
-- patient_registrations: Add INSERT and UPDATE policies
-- ============================================================================

-- Allow users with patients.write permission to register patients at their hospital
CREATE POLICY patient_registrations_insert ON patient_registrations
    FOR INSERT 
    WITH CHECK (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'patients.write')
    );

-- Allow users with patients.write permission to update patient registrations
CREATE POLICY patient_registrations_update ON patient_registrations
    FOR UPDATE 
    USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'patients.write')
    )
    WITH CHECK (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'patients.write')
    );

-- ============================================================================
-- doctor_profiles: Add INSERT and UPDATE policies
-- ============================================================================

-- Allow users with doctors.write permission to create doctor profiles
-- Uses EXISTS subquery to check hospital scope via memberships table
CREATE POLICY doctor_profiles_insert ON doctor_profiles
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.id = membership_id
              AND rbac_effective_hospital_permission(auth.uid(), m.hospital_id, 'doctors.write')
        )
    );

-- Allow users with doctors.write permission to update doctor profiles
CREATE POLICY doctor_profiles_update ON doctor_profiles
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.id = doctor_profiles.membership_id
              AND rbac_effective_hospital_permission(auth.uid(), m.hospital_id, 'doctors.write')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.id = membership_id
              AND rbac_effective_hospital_permission(auth.uid(), m.hospital_id, 'doctors.write')
        )
    );

-- ============================================================================
-- departments: Add INSERT, UPDATE, and DELETE policies
-- ============================================================================

-- Allow users with departments.write permission to create departments
CREATE POLICY departments_insert ON departments
    FOR INSERT 
    WITH CHECK (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'departments.write')
    );

-- Allow users with departments.write permission to update departments
CREATE POLICY departments_update ON departments
    FOR UPDATE 
    USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'departments.write')
    )
    WITH CHECK (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'departments.write')
    );

-- Allow users with departments.write permission to delete departments
CREATE POLICY departments_delete ON departments
    FOR DELETE 
    USING (
        rbac_effective_hospital_permission(auth.uid(), hospital_id, 'departments.write')
    );
