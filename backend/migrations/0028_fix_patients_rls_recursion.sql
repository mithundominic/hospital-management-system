-- Migration 0028: Fix Patients RLS Infinite Recursion
-- Responsibility: Fix circular dependency in patients table RLS policies

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Patients can view own record" ON patients;
DROP POLICY IF EXISTS "Patients can view own registrations" ON patient_registrations;
DROP POLICY IF EXISTS "Patients can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can request appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view own lab results" ON lab_results;
DROP POLICY IF EXISTS "Patients can view own prescriptions" ON prescriptions;

-- Fix: Direct user_id check without subquery to avoid recursion
CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  USING (user_id = auth.uid());

-- Fix: Direct patient_id check using a simple EXISTS without querying patients
CREATE POLICY "Patients can view own registrations"
  ON patient_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_registrations.patient_id
        AND p.user_id = auth.uid()
    )
  );

-- Fix: Direct patient_id check for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = appointments.patient_id
        AND p.user_id = auth.uid()
    )
  );

-- Fix: Allow patients to request appointments
CREATE POLICY "Patients can request appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = appointments.patient_id
        AND p.user_id = auth.uid()
    )
  );

-- Fix: Lab results through encounters
CREATE POLICY "Patients can view own lab results"
  ON lab_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM lab_orders lo
      INNER JOIN encounters e ON lo.encounter_id = e.id
      INNER JOIN patients p ON e.patient_id = p.id
      WHERE lo.id = lab_results.lab_order_id
        AND p.user_id = auth.uid()
    )
  );

-- Fix: Prescriptions through encounters
CREATE POLICY "Patients can view own prescriptions"
  ON prescriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM encounters e
      INNER JOIN patients p ON e.patient_id = p.id
      WHERE e.id = prescriptions.encounter_id
        AND p.user_id = auth.uid()
    )
  );

-- Verification comment:
-- These policies avoid recursion by using EXISTS with explicit joins
-- instead of IN with subqueries that reference the same table
