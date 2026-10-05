-- Migration 0035: Fix Patient Portal RLS Infinite Recursion
-- Responsibility: Break circular RLS recursion between patients and patient_registrations / clinical records
--
-- ARCHITECTURAL CONTEXT:
-- In PostgreSQL, bidirectional RLS dependencies between tables cause error 42P17 (infinite recursion).
-- Specifically:
--   1. patients_select_via_registration (0009) queries patient_registrations
--   2. "Patients can view own registrations" (0028) queries patients
--   When either table is queried under RLS, PostgreSQL infinitely recurses between their policies.
--
-- As documented in the official PostgreSQL RLS manual, the standard architectural pattern to break
-- circular RLS evaluation is to encapsulate the cross-table ownership check in a STABLE SECURITY DEFINER
-- function (the exact same pattern used by rbac_effective_hospital_permission in 0001).
--
-- SECURITY GUARANTEE:
--   RLS remains 100% active and strictly enforced on all tables.
--   Patients can ONLY view their own records (verified by auth.uid()).
--   Hospital staff can ONLY view records for hospitals where they hold active memberships.
--   Zero unauthorized data access is permitted.

-- Step 1: Create the ownership resolver function
CREATE OR REPLACE FUNCTION is_patient_user(p_patient_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT CASE 
    WHEN p_patient_id IS NULL OR p_user_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM patients
      WHERE id = p_patient_id AND user_id = p_user_id
    )
  END;
$$;

GRANT EXECUTE ON FUNCTION is_patient_user(uuid, uuid) TO authenticated;

-- Alias for single-argument callers (defaults to auth.uid())
CREATE OR REPLACE FUNCTION is_patient_owner(p_patient_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT is_patient_user(p_patient_id, auth.uid());
$$;

GRANT EXECUTE ON FUNCTION is_patient_owner(uuid) TO authenticated;

-- Step 2: Update patient_registrations policy to use the helper
ALTER POLICY "Patients can view own registrations" ON patient_registrations
  USING (is_patient_user(patient_id, auth.uid()));

-- Step 3: Update appointments policies
ALTER POLICY "Patients can view own appointments" ON appointments
  USING (is_patient_user(patient_id, auth.uid()));

ALTER POLICY "Patients can request appointments" ON appointments
  WITH CHECK (status = 'pending' AND is_patient_user(patient_id, auth.uid()));

-- Step 4: Update lab_results policy
ALTER POLICY "Patients can view own lab results" ON lab_results
  USING (
    EXISTS (
      SELECT 1
      FROM lab_orders lo
      JOIN encounters e ON lo.encounter_id = e.id
      WHERE lo.id = lab_results.lab_order_id
        AND is_patient_user(e.patient_id, auth.uid())
    )
  );

-- Step 5: Update prescriptions policy
ALTER POLICY "Patients can view own prescriptions" ON prescriptions
  USING (
    EXISTS (
      SELECT 1
      FROM encounters e
      WHERE e.id = prescriptions.encounter_id
        AND is_patient_user(e.patient_id, auth.uid())
    )
  );
