-- Migration 0025: Patient Portal Foundation
-- Responsibility: Add patient self-service portal RBAC and RLS policies

-- Add user_id to patients table to link Supabase Auth users
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Index for efficient user_id lookups
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);

-- Insert Patient role (hospital-scoped like other roles)
INSERT INTO roles (name, scope, description)
VALUES (
  'Patient',
  'hospital',
  'Patient portal user with self-service access to own medical records'
)
ON CONFLICT (name) DO NOTHING;

-- Insert patient portal permissions
INSERT INTO permissions (key, description) VALUES
  ('appointments.read_own', 'View own appointments'),
  ('appointments.request', 'Request new appointments (pending approval)'),
  ('lab.read_own', 'View own lab results'),
  ('prescriptions.read_own', 'View own prescriptions')
ON CONFLICT (key) DO NOTHING;

-- Grant all 4 permissions to Patient role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Patient'
  AND p.key IN (
    'appointments.read_own',
    'appointments.request',
    'lab.read_own',
    'prescriptions.read_own'
  )
ON CONFLICT DO NOTHING;

-- RLS Policy: Patients can view own patient record
CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Patients can view own registrations
CREATE POLICY "Patients can view own registrations"
  ON patient_registrations FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Patients can view own appointments
-- appointments.patient_id links directly to patients.id
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Patients can request appointments (insert with status='pending')
CREATE POLICY "Patients can request appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    status = 'pending' AND
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Patients can view own lab results
-- lab_results -> lab_orders -> encounters -> patients
CREATE POLICY "Patients can view own lab results"
  ON lab_results FOR SELECT
  USING (
    lab_order_id IN (
      SELECT lo.id FROM lab_orders lo
      INNER JOIN encounters e ON lo.encounter_id = e.id
      WHERE e.patient_id IN (
        SELECT id FROM patients WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policy: Patients can view own prescriptions
-- prescriptions -> encounters -> patients
CREATE POLICY "Patients can view own prescriptions"
  ON prescriptions FOR SELECT
  USING (
    encounter_id IN (
      SELECT e.id FROM encounters e
      WHERE e.patient_id IN (
        SELECT id FROM patients WHERE user_id = auth.uid()
      )
    )
  );
