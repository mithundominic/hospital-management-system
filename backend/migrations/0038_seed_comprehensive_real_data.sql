-- 0037_seed_comprehensive_real_data.sql
-- Responsibility: Comprehensive, realistic real-world seed data for every table and every page
-- Covers: Hospitals, RBAC Memberships, Doctors, Departments, Patients, Registrations,
-- Appointments, Encounters, Prescriptions, Prescription Items, Lab Orders, Lab Results,
-- Beds, Admissions, Inventory Items, Stock Transactions, Invoices, Line Items, Payments,
-- Insurance Policies, Claims, Staff Shifts, Biometric Devices, Attendance, Leave Management,
-- ABDM Integration, Hospital Branding, BAA Compliance Documents, Lifecycle Events & Audits.

-- ============================================================================
-- 1. AUTH USERS & IDENTITIES
-- ============================================================================
-- Real staff accounts and test accounts with password 'Hospital@2026'

INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES
  ('a1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.arvind@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Arvind R. Natarajan"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.sunita@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Sunita V. Deshmukh"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.vikram@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Vikramaditya Reddy"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.meenakshi@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Meenakshi Sundaram"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dr.priya@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Priya S. Kulkarni"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nurse.maria@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sister Maria Joseph"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nurse.anitha@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sister Anitha Kumari"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'reception.ramesh@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Ramesh Balan"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pharmacy.suresh@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Suresh Chandran"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lab.karthik@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Karthikeyan M"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'billing.venkat@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Venkatesh Prasad"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'patient.rajesh@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Rajesh Kumar Subramanian"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'patient.priya@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Priya Anand Sharma"}'::jsonb, now(), now(), '', '', '', ''),
  ('a1000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'patient.murugan@hospital.com', crypt('Hospital@2026', gen_salt('bf', 10)), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Murugan Venkatachalam"}'::jsonb, now(), now(), '', '', '', '')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '{"sub":"a1000000-0000-0000-0000-000000000001","email":"dr.arvind@hospital.com","email_verified":true}'::jsonb, 'email', 'dr.arvind@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', '{"sub":"a1000000-0000-0000-0000-000000000002","email":"dr.sunita@hospital.com","email_verified":true}'::jsonb, 'email', 'dr.sunita@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', '{"sub":"a1000000-0000-0000-0000-000000000003","email":"dr.vikram@hospital.com","email_verified":true}'::jsonb, 'email', 'dr.vikram@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', '{"sub":"a1000000-0000-0000-0000-000000000004","email":"dr.meenakshi@hospital.com","email_verified":true}'::jsonb, 'email', 'dr.meenakshi@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', '{"sub":"a1000000-0000-0000-0000-000000000005","email":"dr.priya@hospital.com","email_verified":true}'::jsonb, 'email', 'dr.priya@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000006', '{"sub":"a1000000-0000-0000-0000-000000000006","email":"nurse.maria@hospital.com","email_verified":true}'::jsonb, 'email', 'nurse.maria@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007', '{"sub":"a1000000-0000-0000-0000-000000000007","email":"nurse.anitha@hospital.com","email_verified":true}'::jsonb, 'email', 'nurse.anitha@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000008', '{"sub":"a1000000-0000-0000-0000-000000000008","email":"reception.ramesh@hospital.com","email_verified":true}'::jsonb, 'email', 'reception.ramesh@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000009', '{"sub":"a1000000-0000-0000-0000-000000000009","email":"pharmacy.suresh@hospital.com","email_verified":true}'::jsonb, 'email', 'pharmacy.suresh@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000010', '{"sub":"a1000000-0000-0000-0000-000000000010","email":"lab.karthik@hospital.com","email_verified":true}'::jsonb, 'email', 'lab.karthik@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000011', '{"sub":"a1000000-0000-0000-0000-000000000011","email":"billing.venkat@hospital.com","email_verified":true}'::jsonb, 'email', 'billing.venkat@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000012', '{"sub":"a1000000-0000-0000-0000-000000000012","email":"patient.rajesh@hospital.com","email_verified":true}'::jsonb, 'email', 'patient.rajesh@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000013', '{"sub":"a1000000-0000-0000-0000-000000000013","email":"patient.priya@hospital.com","email_verified":true}'::jsonb, 'email', 'patient.priya@hospital.com', now(), now(), now()),
  ('a1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000014', '{"sub":"a1000000-0000-0000-0000-000000000014","email":"patient.murugan@hospital.com","email_verified":true}'::jsonb, 'email', 'patient.murugan@hospital.com', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. HOSPITALS
-- ============================================================================

INSERT INTO hospitals (
  id, name, registration_number, address, city, state, pincode, is_active,
  phone, email, website, brand_color, gst_number, nabh_number,
  tagline, timezone, locale, currency, status
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Apollo Hospitals', 'REG-APO-2024-001', '21 Greams Lane, Off Greams Road, Thousand Lights', 'Chennai', 'Tamil Nadu', '600006', true, '+91 44 2829 0200', 'chennai@apollohospitals.com', 'https://www.apollohospitals.com', '#0284c7', '33AAACA5443N4ZM', 'NABH-HOS-2006-0001', 'Touching Lives, Healing with Compassion', 'Asia/Kolkata', 'en-IN', 'INR', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Fortis Memorial Research Institute', 'REG-FOR-2024-002', 'Sector 44, Opposite HUDA City Centre', 'Gurugram', 'Haryana', '122002', true, '+91 124 496 2200', 'contactus.fmri@fortishealthcare.com', 'https://www.fortishealthcare.com', '#16a34a', '06AAACF1234N1ZQ', 'NABH-HOS-2012-0045', 'Saving and Enriching Lives', 'Asia/Kolkata', 'en-IN', 'INR', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Narayana Multispeciality Hospital', 'REG-NAR-2024-003', '258/A, Bommasandra Industrial Area, Hosur Road', 'Bengaluru', 'Karnataka', '560099', true, '+91 80 7122 2222', 'info.nh@narayanahealth.org', 'https://www.narayanahealth.org', '#ea580c', '29AAACN5678M1ZU', 'NABH-HOS-2014-0089', 'Healthcare with a Heart', 'Asia/Kolkata', 'en-IN', 'INR', 'active'),
  ('d444bfba-c334-4e79-9d45-7d8ab5471e22', 'Demo General Hospital', 'DEMO-2024-001', '100 Anna Salai, Guindy', 'Chennai', 'Tamil Nadu', '600032', true, '+91 44 2235 1000', 'contact@demohospital.com', 'https://www.demohospital.com', '#2563eb', '33AAACD9999P1ZA', 'NABH-HOS-2021-0112', 'Excellence in Comprehensive Patient Care', 'Asia/Kolkata', 'en-IN', 'INR', 'active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  pincode = EXCLUDED.pincode,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  brand_color = EXCLUDED.brand_color,
  gst_number = EXCLUDED.gst_number,
  nabh_number = EXCLUDED.nabh_number,
  tagline = EXCLUDED.tagline,
  timezone = EXCLUDED.timezone,
  currency = EXCLUDED.currency,
  status = EXCLUDED.status;

-- ============================================================================
-- 3. HOSPITAL BRANDING & BAA DOCUMENTS
-- ============================================================================

INSERT INTO hospital_branding (hospital_id, logo_url, color_scheme, custom_domain, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150', '{"primary":"#0284c7","secondary":"#0f172a","accent":"#10b981"}'::jsonb, 'portal.apollohospitals.org', now()),
  ('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=150', '{"primary":"#16a34a","secondary":"#14532d","accent":"#3b82f6"}'::jsonb, 'care.fortishealthcare.com', now()),
  ('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=150', '{"primary":"#ea580c","secondary":"#7c2d12","accent":"#06b6d4"}'::jsonb, 'health.narayana.org', now()),
  ('d444bfba-c334-4e79-9d45-7d8ab5471e22', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=150', '{"primary":"#2563eb","secondary":"#1e293b","accent":"#10b981"}'::jsonb, 'demo.hospitalsaas.io', now())
ON CONFLICT (hospital_id) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  color_scheme = EXCLUDED.color_scheme,
  custom_domain = EXCLUDED.custom_domain;

INSERT INTO hospital_baa_documents (id, hospital_id, document_url, signed_at, expires_at, created_at)
VALUES
  ('b0000000-0000-0000-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'https://storage.hospitalsaas.io/legal/baa/apollo-chennai-baa-2026.pdf', now() - interval '6 months', now() + interval '18 months', now() - interval '6 months'),
  ('b0000000-0000-0000-0001-000000000002', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'https://storage.hospitalsaas.io/legal/baa/demo-hospital-baa-2026.pdf', now() - interval '3 months', now() + interval '21 months', now() - interval '3 months')
ON CONFLICT (id) DO NOTHING;

INSERT INTO hospital_lifecycle_events (id, hospital_id, event_type, reason, metadata, created_at)
VALUES
  ('b0000000-0000-0000-0002-000000000001', '11111111-1111-1111-1111-111111111111', 'created', 'Initial hospital tenant provisioning', '{"initiated_by":"system_provisioning"}'::jsonb, now() - interval '1 year'),
  ('b0000000-0000-0000-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'activated', 'Hospital tenant activated for clinical operations', '{"active_beds":150}'::jsonb, now() - interval '6 months'),
  ('b0000000-0000-0000-0002-000000000003', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'created', 'Demonstration environment initialized', '{"demo_mode":true}'::jsonb, now() - interval '3 months'),
  ('b0000000-0000-0000-0002-000000000004', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'activated', 'Demo hospital activated', '{"active_beds":20}'::jsonb, now() - interval '3 months')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tenant_isolation_audits (id, audit_type, findings, audited_at)
VALUES
  ('b0000000-0000-0000-0003-000000000001', 'rls_verification', '{"status":"PASS","tested_tables":41,"cross_tenant_leakage":0,"execution_time_ms":42}'::jsonb, now() - interval '1 day'),
  ('b0000000-0000-0000-0003-000000000002', 'cross_tenant_query', '{"status":"PASS","verified_boundaries":["hospitals","patients","invoices","prescriptions"]}'::jsonb, now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. DEPARTMENTS
-- ============================================================================

INSERT INTO departments (id, hospital_id, name)
VALUES
  -- Apollo Hospitals Departments
  ('b0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Cardiology'),
  ('b0000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'General Medicine'),
  ('b0000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Orthopedics & Joint Replacement'),
  ('b0000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Pediatrics & Neonatology'),
  ('b0000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Dermatology & Cosmetology'),
  ('b0000001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'General & Laparoscopic Surgery'),
  ('b0000001-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Neurology'),
  ('b0000001-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Obstetrics & Gynecology'),
  ('b0000001-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'Emergency & Critical Care'),
  ('b0000001-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', 'Pathology & Laboratory Medicine'),

  -- Demo General Hospital Departments
  ('b0000001-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'Cardiology'),
  ('b0000001-0000-0000-0000-000000000012', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'General Medicine'),
  ('b0000001-0000-0000-0000-000000000013', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'Orthopedics & Joint Replacement'),
  ('b0000001-0000-0000-0000-000000000014', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'Pediatrics & Neonatology'),
  ('b0000001-0000-0000-0000-000000000015', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'Emergency & Critical Care')
ON CONFLICT (hospital_id, name) DO NOTHING;

-- ============================================================================
-- 5. MEMBERSHIPS
-- ============================================================================

INSERT INTO memberships (id, user_id, hospital_id, role_id, status)
VALUES
  -- Apollo HospitalAdmins
  ('80000000-0000-0000-0000-000000000001', '3d7bb07c-4078-46f1-99f9-f168a2c004b5', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'HospitalAdmin'), 'active'),
  ('80000000-0000-0000-0000-000000000002', '02eb4624-b59d-4a77-9445-ec21ccbdce7e', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'HospitalAdmin'), 'active'),
  ('80000000-0000-0000-0000-000000000003', 'cec9174f-8f69-47a4-821b-6fefb8398f1d', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'HospitalAdmin'), 'active'),

  -- Demo HospitalAdmins
  ('80000000-0000-0000-0000-000000000004', 'cec9174f-8f69-47a4-821b-6fefb8398f1d', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'HospitalAdmin'), 'active'),

  -- Apollo Doctors
  ('80000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),
  ('80000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),
  ('80000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),
  ('80000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),
  ('80000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),

  -- Apollo Nurses
  ('80000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Nurse'), 'active'),
  ('80000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Nurse'), 'active'),

  -- Apollo Operational Staff
  ('80000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Receptionist'), 'active'),
  ('80000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Pharmacist'), 'active'),
  ('80000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'LabTech'), 'active'),
  ('80000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'BillingClerk'), 'active'),

  -- Apollo Patients
  ('80000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Patient'), 'active'),
  ('80000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Patient'), 'active'),
  ('80000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE name = 'Patient'), 'active'),

  -- Demo Hospital Staff Memberships
  ('80000000-0000-0000-0001-000000000001', 'a1000000-0000-0000-0000-000000000002', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),
  ('80000000-0000-0000-0001-000000000002', 'a1000000-0000-0000-0000-000000000003', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'Doctor'), 'active'),
  ('80000000-0000-0000-0001-000000000003', 'a1000000-0000-0000-0000-000000000006', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'Nurse'), 'active'),
  ('80000000-0000-0000-0001-000000000004', 'a1000000-0000-0000-0000-000000000008', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'Receptionist'), 'active'),
  ('80000000-0000-0000-0001-000000000005', 'a1000000-0000-0000-0000-000000000009', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'Pharmacist'), 'active'),
  ('80000000-0000-0000-0001-000000000006', 'a1000000-0000-0000-0000-000000000010', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'LabTech'), 'active'),
  ('80000000-0000-0000-0001-000000000007', 'a1000000-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', (SELECT id FROM roles WHERE name = 'BillingClerk'), 'active')
ON CONFLICT (user_id, hospital_id, role_id) DO NOTHING;

-- ============================================================================
-- 6. DOCTOR PROFILES
-- ============================================================================

INSERT INTO doctor_profiles (
  id, membership_id, department_id, specialization, registration_number, qualifications, consultation_fee
) VALUES
  ('b0000002-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', 'Interventional Cardiology', 'MCI-28491', 'MBBS, MD (Medicine), DM (Cardiology), FACC', 1500.00),
  ('b0000002-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', 'Internal Medicine & Diabetology', 'MMC-49102', 'MBBS, MD (Internal Medicine), FACP', 800.00),
  ('b0000002-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003', 'Orthopedic & Joint Replacement Surgery', 'APMC-39182', 'MBBS, MS (Orthopedics), MCh (Ortho)', 1200.00),
  ('b0000002-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004', 'Pediatrics & Pediatric Intensive Care', 'TNMC-65201', 'MBBS, DCH, MD (Pediatrics)', 1000.00),
  ('b0000002-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000005', 'Dermatology & Venereology', 'KMC-51029', 'MBBS, MD (Dermatology, Venereology & Leprosy)', 900.00),
  ('b0000002-0000-0000-0000-000000000011', '80000000-0000-0000-0001-000000000001', 'b0000001-0000-0000-0000-000000000012', 'General Medicine & Family Practice', 'MMC-49102-D', 'MBBS, MD (General Medicine)', 600.00),
  ('b0000002-0000-0000-0000-000000000012', '80000000-0000-0000-0001-000000000002', 'b0000001-0000-0000-0000-000000000013', 'Orthopedics & Sports Medicine', 'APMC-39182-D', 'MBBS, MS (Orthopedics)', 800.00)
ON CONFLICT (membership_id) DO UPDATE SET
  specialization = EXCLUDED.specialization,
  registration_number = EXCLUDED.registration_number,
  qualifications = EXCLUDED.qualifications,
  consultation_fee = EXCLUDED.consultation_fee;

-- ============================================================================
-- 7. PATIENTS
-- ============================================================================

INSERT INTO patients (
  id, full_name, dob, gender, phone, email, blood_group, abha_id, abha_address, abha_verified, user_id, created_at
) VALUES
  ('b0000003-0000-0000-0000-000000000001', 'Rajesh Kumar Subramanian', '1978-04-12', 'male', '+91 98401 23456', 'rajesh.subramanian@gmail.com', 'O+', '14-8291-0394-5821', 'rajesh.subramanian@abdm', true, 'a1000000-0000-0000-0000-000000000012', now() - interval '1 year'),
  ('b0000003-0000-0000-0000-000000000002', 'Priya Anand Sharma', '1992-08-25', 'female', '+91 98840 54321', 'priya.sharma92@outlook.com', 'B+', '14-3918-2049-1182', 'priya.sharma@abdm', true, 'a1000000-0000-0000-0000-000000000013', now() - interval '1 year'),
  ('b0000003-0000-0000-0000-000000000003', 'Murugan Venkatachalam', '1959-11-03', 'male', '+91 94440 98765', 'murugan.v1959@yahoo.co.in', 'A+', '14-7729-1049-3829', 'murugan.v@abdm', true, 'a1000000-0000-0000-0000-000000000014', now() - interval '8 months'),
  ('b0000003-0000-0000-0000-000000000004', 'Ananya Karthik', '2018-03-14', 'female', '+91 97100 11223', 'karthik.parent@gmail.com', 'O-', '14-9912-3847-5610', 'ananya.k@abdm', true, null, now() - interval '6 months'),
  ('b0000003-0000-0000-0000-000000000005', 'Sneha Harish Patel', '1998-06-19', 'female', '+91 99620 44556', 'sneha.patel98@gmail.com', 'AB+', '14-6102-4829-9102', 'sneha.patel@abdm', true, null, now() - interval '5 months'),
  ('b0000003-0000-0000-0000-000000000006', 'Abdul Rahim Siddiqui', '1970-01-15', 'male', '+91 98410 77889', 'a.rahim.siddiqui@rediffmail.com', 'B-', '14-2284-9103-4712', 'abdul.rahim@abdm', true, null, now() - interval '4 months'),
  ('b0000003-0000-0000-0000-000000000007', 'Deepa Sivakumar', '1984-09-30', 'female', '+91 98844 33221', 'deepa.sivakumar@gmail.com', 'A-', '14-5541-2903-8841', 'deepa.s@abdm', true, null, now() - interval '3 months'),
  ('b0000003-0000-0000-0000-000000000008', 'Vikramaditya Nair', '1988-12-08', 'male', '+91 98408 66778', 'vikram.nair88@gmail.com', 'O+', '14-4419-7281-0029', 'vikram.nair@abdm', true, null, now() - interval '2 months'),
  ('b0000003-0000-0000-0000-000000000009', 'Kavita Chidambaram', '1964-05-12', 'female', '+91 94441 22334', 'kavita.chidambaram@gmail.com', 'AB-', '14-3829-1049-5561', 'kavita.c@abdm', true, null, now() - interval '1 month'),
  ('b0000003-0000-0000-0000-00000000000a', 'Aarav Pranav Mehta', '2021-07-22', 'male', '+91 98842 99887', 'pranav.mehta.parent@gmail.com', 'B+', '14-1182-9402-3719', 'aarav.mehta@abdm', true, null, now() - interval '15 days')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  blood_group = EXCLUDED.blood_group,
  abha_id = EXCLUDED.abha_id,
  abha_address = EXCLUDED.abha_address,
  abha_verified = EXCLUDED.abha_verified,
  user_id = EXCLUDED.user_id;

-- ============================================================================
-- 8. PATIENT REGISTRATIONS
-- ============================================================================

INSERT INTO patient_registrations (id, patient_id, hospital_id, hospital_patient_number, registered_at)
VALUES
  -- Apollo Hospital Registrations
  ('b0000004-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'APO-2024-00101', now() - interval '1 year'),
  ('b0000004-0000-0000-0000-000000000002', 'b0000003-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'APO-2024-00102', now() - interval '1 year'),
  ('b0000004-0000-0000-0000-000000000003', 'b0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'APO-2024-00103', now() - interval '8 months'),
  ('b0000004-0000-0000-0000-000000000004', 'b0000003-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'APO-2024-00104', now() - interval '6 months'),
  ('b0000004-0000-0000-0000-000000000005', 'b0000003-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'APO-2024-00105', now() - interval '5 months'),
  ('b0000004-0000-0000-0000-000000000006', 'b0000003-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'APO-2024-00106', now() - interval '4 months'),
  ('b0000004-0000-0000-0000-000000000007', 'b0000003-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'APO-2024-00107', now() - interval '3 months'),
  ('b0000004-0000-0000-0000-000000000008', 'b0000003-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'APO-2024-00108', now() - interval '2 months'),
  ('b0000004-0000-0000-0000-000000000009', 'b0000003-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'APO-2024-00109', now() - interval '1 month'),
  ('b0000004-0000-0000-0000-00000000000a', 'b0000003-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', 'APO-2024-00110', now() - interval '15 days'),

  -- Demo Hospital Registrations
  ('b0000004-0000-0000-0000-000000000011', 'b0000003-0000-0000-0000-000000000001', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'DGH-2024-00001', now() - interval '1 year'),
  ('b0000004-0000-0000-0000-000000000012', 'b0000003-0000-0000-0000-000000000002', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'DGH-2024-00002', now() - interval '1 year'),
  ('b0000004-0000-0000-0000-000000000013', 'b0000003-0000-0000-0000-000000000003', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'DGH-2024-00003', now() - interval '8 months')
ON CONFLICT (hospital_id, hospital_patient_number) DO NOTHING;

-- ============================================================================
-- 9. IPD BEDS
-- ============================================================================

INSERT INTO beds (id, hospital_id, department_id, bed_number, ward, status, created_at)
VALUES
  -- Apollo Beds
  ('b0000005-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000001', 'CCU-01', 'Coronary Care Unit', 'occupied', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000001', 'CCU-02', 'Coronary Care Unit', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000009', 'ICU-101', 'Intensive Care Unit', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000009', 'ICU-102', 'Intensive Care Unit', 'maintenance', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000002', 'GMW-201', 'General Male Ward', 'occupied', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000002', 'GMW-202', 'General Male Ward', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000002', 'GMW-203', 'General Male Ward', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000002', 'GFW-204', 'General Female Ward', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000002', 'GFW-205', 'General Female Ward', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000003', 'SPW-301', 'Semi-Private Ward', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-00000000000b', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000003', 'SPW-302', 'Semi-Private Ward', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-00000000000c', '11111111-1111-1111-1111-111111111111', 'b0000001-0000-0000-0000-000000000003', 'DPS-401', 'Deluxe Private Suite', 'available', now() - interval '1 year'),

  -- Demo Hospital Beds
  ('b0000005-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000001-0000-0000-0000-000000000011', 'CCU-01', 'Coronary Care Unit', 'available', now() - interval '1 year'),
  ('b0000005-0000-0000-0000-000000000012', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000001-0000-0000-0000-000000000012', 'GMW-101', 'General Male Ward', 'available', now() - interval '1 year')
ON CONFLICT (hospital_id, bed_number) DO UPDATE SET
  ward = EXCLUDED.ward,
  status = EXCLUDED.status;

-- ============================================================================
-- 10. APPOINTMENTS
-- ============================================================================

INSERT INTO appointments (
  id, hospital_id, patient_id, doctor_membership_id, department_id, scheduled_at, status, notes, created_at, updated_at
) VALUES
  ('b0000006-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', now() - interval '30 days', 'completed', 'Exertional chest tightness and shortness of breath', now() - interval '35 days', now() - interval '30 days'),
  ('b0000006-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003', now() - interval '15 days', 'completed', 'Severe right knee osteoarthritis pain, evaluation for TKA', now() - interval '20 days', now() - interval '15 days'),
  ('b0000006-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000005', now() - interval '5 days', 'completed', 'Allergic rash over neck and flexor forearms', now() - interval '6 days', now() - interval '5 days'),
  ('b0000006-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000006', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', now() - interval '3 days', 'completed', 'Uncontrolled diabetes with polyuria and fatigue', now() - interval '4 days', now() - interval '3 days'),
  ('b0000006-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004', now() - interval '2 days', 'completed', 'High grade fever with dry cough for 3 days', now() - interval '2 days', now() - interval '2 days'),
  ('b0000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000007', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', date_trunc('day', now()) + interval '10 hours 30 minutes', 'confirmed', 'Follow-up for chronic hypertension & metabolic checkup', now() - interval '1 day', now()),
  ('b0000006-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000008', '80000000-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003', date_trunc('day', now()) + interval '14 hours', 'confirmed', 'Post-operative orthopedic mobility check', now() - interval '2 days', now()),
  ('b0000006-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', date_trunc('day', now()) + interval '1 day 11 hours', 'booked', 'Palpitations and occasional postural dizziness', now(), now()),
  ('b0000006-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-00000000000a', '80000000-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004', date_trunc('day', now()) + interval '2 days 9 hours 30 minutes', 'booked', '5-year developmental checkup & MMR booster', now(), now()),
  ('b0000006-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000009', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', now() - interval '7 days', 'cancelled', 'Patient requested reschedule due to outstation travel', now() - interval '10 days', now() - interval '8 days'),

  -- Demo Hospital Appointments
  ('b0000006-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000003-0000-0000-0000-000000000001', '80000000-0000-0000-0001-000000000001', 'b0000001-0000-0000-0000-000000000012', now() - interval '2 days', 'completed', 'Routine health checkup and blood pressure monitoring', now() - interval '3 days', now() - interval '2 days'),
  ('b0000006-0000-0000-0000-000000000012', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000003-0000-0000-0000-000000000002', '80000000-0000-0000-0001-000000000002', 'b0000001-0000-0000-0000-000000000013', date_trunc('day', now()) + interval '11 hours', 'confirmed', 'Evaluation of ankle sprain after badminton game', now() - interval '1 day', now())
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  scheduled_at = EXCLUDED.scheduled_at,
  notes = EXCLUDED.notes;

-- ============================================================================
-- 11. ENCOUNTERS
-- ============================================================================

INSERT INTO encounters (
  id, hospital_id, patient_id, appointment_id, doctor_membership_id, department_id,
  encounter_type, status, chief_complaint, vitals, diagnosis, clinical_notes,
  started_at, ended_at, created_at
) VALUES
  ('b0000007-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000001', 'b0000006-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001',
   'opd', 'finalized', 'Retrosternal chest tightness radiating to left arm on exertion for 3 weeks',
   '{"bp_systolic": 146, "bp_diastolic": 92, "pulse_rate": 86, "temperature": 98.4, "spo2": 97, "weight_kg": 78, "height_cm": 174}'::jsonb,
   'I20.8 - Other forms of angina pectoris; Essential (primary) hypertension (I10)',
   'S1 S2 heard. No murmurs. 12-lead ECG reveals 1.5mm ST segment depressions in leads V5-V6. Cardiac enzymes and lipid profile ordered. Admitted to CCU for angiography.',
   now() - interval '30 days', now() - interval '30 days' + interval '45 minutes', now() - interval '30 days'),

  ('b0000007-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000003', 'b0000006-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003',
   'ipd', 'finalized', 'Severe right knee pain with mechanical locking, unable to walk >50 meters',
   '{"bp_systolic": 132, "bp_diastolic": 82, "pulse_rate": 74, "temperature": 98.6, "spo2": 99, "weight_kg": 84, "height_cm": 168}'::jsonb,
   'M17.11 - Unilateral primary osteoarthritis, right knee (Grade IV Kellgren-Lawrence)',
   'Severe crepitus on passive flexion. Plain radiograph shows complete obliteration of medial joint space with subchondral sclerosis. Admitted for elective Right Total Knee Arthroplasty (TKA).',
   now() - interval '15 days', now() - interval '15 days' + interval '60 minutes', now() - interval '15 days'),

  ('b0000007-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000005', 'b0000006-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000005',
   'opd', 'finalized', 'Pruritic erythematous rash across neck and forearms following cosmetic application',
   '{"bp_systolic": 118, "bp_diastolic": 76, "pulse_rate": 72, "temperature": 98.6, "spo2": 99, "weight_kg": 54, "height_cm": 162}'::jsonb,
   'L23.9 - Allergic contact dermatitis, unspecified cause',
   'Erythematous papules and microvesicles on bilateral forearms. No mucosal involvement. Topical corticosteroids and non-sedating antihistamines prescribed.',
   now() - interval '5 days', now() - interval '5 days' + interval '30 minutes', now() - interval '5 days'),

  ('b0000007-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000006', 'b0000006-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002',
   'ipd', 'finalized', 'Fatigue, polydipsia, blurred vision, random fingerstick blood glucose 295 mg/dL',
   '{"bp_systolic": 138, "bp_diastolic": 86, "pulse_rate": 80, "temperature": 98.5, "spo2": 98, "weight_kg": 82, "height_cm": 170}'::jsonb,
   'E11.65 - Type 2 diabetes mellitus with hyperglycemia; Dyslipidemia (E78.5)',
   'Known diabetic with poor compliance. Urine ketones negative. Hydration initiated with IV normal saline, short-acting insulin correction sliding scale started.',
   now() - interval '3 days', now() - interval '3 days' + interval '40 minutes', now() - interval '3 days'),

  ('b0000007-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000004', 'b0000006-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004',
   'emergency', 'finalized', 'High fever 102.4 F with chills, non-productive cough, decreased oral intake',
   '{"bp_systolic": 102, "bp_diastolic": 64, "pulse_rate": 118, "temperature": 102.4, "spo2": 98, "weight_kg": 24, "height_cm": 122}'::jsonb,
   'J06.9 - Acute upper respiratory infection, unspecified; Febrile illness',
   'Chest clear on auscultation. Throat congested. Dengue NS1 antigen and CBC drawn in emergency triage. Paracetamol drops administered, fever brought down to 99.2 F.',
   now() - interval '2 days', now() - interval '2 days' + interval '2 hours', now() - interval '2 days'),

  -- Demo Hospital Encounter
  ('b0000007-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000003-0000-0000-0000-000000000001', 'b0000006-0000-0000-0000-000000000011', '80000000-0000-0000-0001-000000000001', 'b0000001-0000-0000-0000-000000000012',
   'opd', 'finalized', 'Mild headache and feeling fatigued for past 4 days',
   '{"bp_systolic": 128, "bp_diastolic": 82, "pulse_rate": 76, "temperature": 98.4, "spo2": 99, "weight_kg": 76, "height_cm": 174}'::jsonb,
   'R53.83 - Other fatigue; Tension-type headache (G44.2)',
   'Physical exam unremarkable. Advised stress reduction, adequate hydration, and light analgesics.',
   now() - interval '2 days', now() - interval '2 days' + interval '25 minutes', now() - interval '2 days')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  vitals = EXCLUDED.vitals,
  diagnosis = EXCLUDED.diagnosis,
  clinical_notes = EXCLUDED.clinical_notes;

-- ============================================================================
-- 12. PRESCRIPTIONS & PRESCRIPTION ITEMS
-- ============================================================================

INSERT INTO prescriptions (id, encounter_id, hospital_id, prescribed_by, notes, created_at)
VALUES
  ('b0000008-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000011', 'Cardiology discharge regimen. Strict compliance with antiplatelet therapy.', now() - interval '30 days'),
  ('b0000008-0000-0000-0000-000000000002', 'b0000007-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000013', 'Post-Op Knee Replacement discharge medications. Complete course of antibiotics.', now() - interval '10 days'),
  ('b0000008-0000-0000-0000-000000000003', 'b0000007-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000015', 'Dermatology prescription. Avoid known cosmetic allergen.', now() - interval '5 days'),
  ('b0000008-0000-0000-0000-000000000004', 'b0000007-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000012', 'Diabetic management regimen. Monitor fasting glucose thrice weekly.', now() - interval '3 days'),
  ('b0000008-0000-0000-0000-000000000011', 'b0000007-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', '80000000-0000-0000-0001-000000000001', 'Take medications with meals', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescription_items (id, prescription_id, medicine_name, dosage, frequency, duration_days, instructions)
VALUES
  -- Cardiology Rx
  ('b0000009-0000-0000-0000-000000000001', 'b0000008-0000-0000-0000-000000000001', 'Atorvastatin 20mg (Atorva)', '20 mg', 'Once daily at bedtime', 30, 'Take after dinner with water'),
  ('b0000009-0000-0000-0000-000000000002', 'b0000008-0000-0000-0000-000000000001', 'Aspirin 75mg (Ecosprin 75)', '75 mg', 'Once daily after breakfast', 30, 'Take strictly after meals'),
  ('b0000009-0000-0000-0000-000000000003', 'b0000008-0000-0000-0000-000000000001', 'Metoprolol Succinate 25mg ER', '25 mg', 'Twice daily', 30, 'Morning and evening after meals'),
  ('b0000009-0000-0000-0000-000000000004', 'b0000008-0000-0000-0000-000000000001', 'Telmisartan 40mg (Telma 40)', '40 mg', 'Once daily in morning', 30, 'Check blood pressure weekly'),

  -- Orthopedic Post-Op Rx
  ('b0000009-0000-0000-0000-000000000005', 'b0000008-0000-0000-0000-000000000002', 'Cefuroxime Axetil 500mg (Ceftum)', '500 mg', 'Twice daily', 7, 'Take after food. Finish all 7 days.'),
  ('b0000009-0000-0000-0000-000000000006', 'b0000008-0000-0000-0000-000000000002', 'Diclofenac + Paracetamol (Voveran Plus)', '50mg/325mg', 'Twice daily as needed', 5, 'Take after meals for pain relief'),
  ('b0000009-0000-0000-0000-000000000007', 'b0000008-0000-0000-0000-000000000002', 'Pantoprazole 40mg (Pan 40)', '40 mg', 'Once daily', 14, 'Take 30 mins before breakfast on empty stomach'),
  ('b0000009-0000-0000-0000-000000000008', 'b0000008-0000-0000-0000-000000000002', 'Calcium Carbonate 500mg + Vit D3', '500 mg', 'Once daily', 60, 'Take after lunch for bone healing'),

  -- Dermatology Rx
  ('b0000009-0000-0000-0000-000000000009', 'b0000008-0000-0000-0000-000000000003', 'Betamethasone Dipropionate 0.05% cream', 'Topical', 'Twice daily', 10, 'Apply thin layer to affected skin only'),
  ('b0000009-0000-0000-0000-00000000000a', 'b0000008-0000-0000-0000-000000000003', 'Levocetirizine 5mg (Levocet)', '5 mg', 'Once daily at bedtime', 10, 'Take before sleeping'),

  -- Diabetology Rx
  ('b0000009-0000-0000-0000-00000000000b', 'b0000008-0000-0000-0000-000000000004', 'Metformin 500mg + Glimepiride 2mg (Glycomet GP 2)', '1 tablet', 'Twice daily with meals', 30, 'Take with breakfast and dinner'),
  ('b0000009-0000-0000-0000-00000000000c', 'b0000008-0000-0000-0000-000000000004', 'Rosuvastatin 10mg', '10 mg', 'Once daily at bedtime', 30, 'Take after dinner'),

  -- Demo Hospital Rx Item
  ('b0000009-0000-0000-0000-000000000011', 'b0000008-0000-0000-0000-000000000011', 'Dolo 650', '650 mg', 'Twice daily PRN', 3, 'Take after food for headache relief')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. LAB ORDERS & LAB RESULTS
-- ============================================================================

INSERT INTO lab_orders (
  id, hospital_id, encounter_id, ordered_by, test_name, status, ordered_at, sample_collected_at
) VALUES
  ('b000000a-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000011', 'Lipid Profile', 'completed', now() - interval '30 days', now() - interval '30 days' + interval '2 hours'),
  ('b000000a-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000011', 'High-Sensitivity Troponin-I', 'completed', now() - interval '30 days', now() - interval '30 days' + interval '1 hour'),
  ('b000000a-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000013', 'Complete Blood Count (CBC)', 'completed', now() - interval '14 days', now() - interval '14 days' + interval '1 hour'),
  ('b000000a-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000012', 'Glycated Hemoglobin (HbA1c)', 'completed', now() - interval '3 days', now() - interval '3 days' + interval '2 hours'),
  ('b000000a-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000014', 'Dengue NS1 Antigen & Platelet Count', 'completed', now() - interval '2 days', now() - interval '2 days' + interval '30 minutes'),
  ('b000000a-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000012', 'Kidney Function Test (KFT)', 'ordered', now() - interval '1 day', null),
  ('b000000a-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000007-0000-0000-0000-000000000011', '80000000-0000-0000-0001-000000000001', 'Fasting Blood Sugar (FBS)', 'completed', now() - interval '2 days', now() - interval '2 days' + interval '1 hour')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

INSERT INTO lab_results (
  id, lab_order_id, result_value, unit, reference_range, is_abnormal, verified_by, result_at, notes
) VALUES
  -- Lipid Profile
  ('b000000b-0000-0000-0000-000000000001', 'b000000a-0000-0000-0000-000000000001', '238', 'mg/dL', '< 200', true, '80000000-0000-0000-0000-000000000020', now() - interval '29 days', 'Elevated total cholesterol. Statin indicated.'),
  ('b000000b-0000-0000-0000-000000000002', 'b000000a-0000-0000-0000-000000000001', '158', 'mg/dL', '< 100', true, '80000000-0000-0000-0000-000000000020', now() - interval '29 days', 'High LDL cholesterol.'),
  ('b000000b-0000-0000-0000-000000000003', 'b000000a-0000-0000-0000-000000000001', '36', 'mg/dL', '> 40', true, '80000000-0000-0000-0000-000000000020', now() - interval '29 days', 'Low protective HDL.'),
  ('b000000b-0000-0000-0000-000000000004', 'b000000a-0000-0000-0000-000000000001', '220', 'mg/dL', '< 150', true, '80000000-0000-0000-0000-000000000020', now() - interval '29 days', 'Hypertriglyceridemia.'),

  -- Troponin-I
  ('b000000b-0000-0000-0000-000000000005', 'b000000a-0000-0000-0000-000000000002', '0.02', 'ng/mL', '< 0.04', false, '80000000-0000-0000-0000-000000000020', now() - interval '29 days', 'Troponin-I within normal limits. Rules out acute myocardial infarction.'),

  -- CBC
  ('b000000b-0000-0000-0000-000000000006', 'b000000a-0000-0000-0000-000000000003', '13.4', 'g/dL', '13.0 - 17.0', false, '80000000-0000-0000-0000-000000000020', now() - interval '13 days', 'Normal pre-operative hemoglobin.'),
  ('b000000b-0000-0000-0000-000000000007', 'b000000a-0000-0000-0000-000000000003', '7800', '/µL', '4000 - 11000', false, '80000000-0000-0000-0000-000000000020', now() - interval '13 days', 'Normal total leucocyte count.'),
  ('b000000b-0000-0000-0000-000000000008', 'b000000a-0000-0000-0000-000000000003', '260000', '/µL', '150000 - 450000', false, '80000000-0000-0000-0000-000000000020', now() - interval '13 days', 'Adequate platelets for surgical clearance.'),

  -- HbA1c
  ('b000000b-0000-0000-0000-000000000009', 'b000000a-0000-0000-0000-000000000004', '8.8', '%', '4.0 - 5.6', true, '80000000-0000-0000-0000-000000000020', now() - interval '2 days', 'Suboptimal glycemic control. Requires escalation of antidiabetic therapy.'),

  -- Dengue NS1 & Platelets
  ('b000000b-0000-0000-0000-00000000000a', 'b000000a-0000-0000-0000-000000000005', 'Negative', '', 'Negative', false, '80000000-0000-0000-0000-000000000020', now() - interval '2 days', 'Dengue NS1 Antigen negative.'),
  ('b000000b-0000-0000-0000-00000000000b', 'b000000a-0000-0000-0000-000000000005', '210000', '/µL', '150000 - 450000', false, '80000000-0000-0000-0000-000000000020', now() - interval '2 days', 'Platelet count normal.'),

  -- Demo Hospital Result
  ('b000000b-0000-0000-0000-000000000011', 'b000000a-0000-0000-0000-000000000011', '98', 'mg/dL', '70 - 100', false, '80000000-0000-0000-0001-000000000006', now() - interval '2 days', 'Fasting blood glucose normal')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 14. IPD ADMISSIONS
-- ============================================================================

INSERT INTO admissions (
  id, hospital_id, encounter_id, patient_id, bed_id, admitting_doctor_membership_id,
  status, admitted_at, discharged_at, discharge_summary
) VALUES
  -- 1. Murugan Venkatachalam: TKA stay (Discharged)
  ('b000000c-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000002', 'b0000003-0000-0000-0000-000000000003', 'b0000005-0000-0000-0000-00000000000a', '80000000-0000-0000-0000-000000000013',
   'discharged', now() - interval '14 days', now() - interval '9 days',
   'Underwent successful Right Total Knee Arthroplasty. Post-op physiotherapy completed. Suture line healthy. Advised regular walker assisted ambulation and quadriceps strengthening exercises.'),

  -- 2. Rajesh Kumar Subramanian: Coronary Care Unit (Currently Admitted)
  ('b000000c-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000001', 'b0000005-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000011',
   'admitted', now() - interval '4 days', null, null),

  -- 3. Abdul Rahim Siddiqui: General Male Ward (Currently Admitted)
  ('b000000c-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b0000007-0000-0000-0000-000000000004', 'b0000003-0000-0000-0000-000000000006', 'b0000005-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000012',
   'admitted', now() - interval '2 days', null, null)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  discharge_summary = EXCLUDED.discharge_summary;

-- ============================================================================
-- 15. PHARMACY INVENTORY & STOCK TRANSACTIONS
-- ============================================================================

INSERT INTO inventory_items (id, hospital_id, name, category, unit, reorder_level, created_at)
VALUES
  -- Apollo Inventory
  ('b000000d-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Dolo 650 (Paracetamol 650mg)', 'medicine', 'Tablets', 1000, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Augmentin 625 Duo (Amoxicillin + Clavulanate)', 'medicine', 'Tablets', 300, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Atorva 20 (Atorvastatin 20mg)', 'medicine', 'Tablets', 250, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Glycomet GP 2 (Metformin + Glimepiride)', 'medicine', 'Tablets', 400, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Telma 40 (Telmisartan 40mg)', 'medicine', 'Tablets', 300, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Pan 40 (Pantoprazole 40mg)', 'medicine', 'Tablets', 500, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Voveran Plus (Diclofenac + Paracetamol)', 'medicine', 'Tablets', 350, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Clexane 40mg/0.4ml (Enoxaparin Injection)', 'medicine', 'PFS', 50, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'Normal Saline 0.9% 500ml Infusion Bottle', 'consumable', 'Bottles', 200, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', 'Ringer Lactate (RL) 500ml Infusion Bottle', 'consumable', 'Bottles', 150, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-00000000000b', '11111111-1111-1111-1111-111111111111', 'Latex Sterile Surgical Gloves 7.5', 'surgical', 'Pairs', 500, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-00000000000c', '11111111-1111-1111-1111-111111111111', 'Dispovan 5ml Disposable Syringes 24G', 'consumable', 'Pieces', 1000, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-00000000000d', '11111111-1111-1111-1111-111111111111', 'BD Venflon IV Cannula 20G Pink', 'consumable', 'Pieces', 200, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-00000000000e', '11111111-1111-1111-1111-111111111111', 'Dynaplast Elastic Adhesive Bandage 10cm', 'consumable', 'Rolls', 100, now() - interval '1 year'),

  -- Demo Hospital Inventory
  ('b000000d-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'Dolo 650 (Paracetamol 650mg)', 'medicine', 'Tablets', 500, now() - interval '1 year'),
  ('b000000d-0000-0000-0000-000000000012', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'Amoxicillin 500mg (Novamox)', 'medicine', 'Capsules', 300, now() - interval '1 year')
ON CONFLICT (hospital_id, name) DO UPDATE SET
  category = EXCLUDED.category,
  unit = EXCLUDED.unit,
  reorder_level = EXCLUDED.reorder_level;

-- Stock transactions: opening purchases and dispensings
INSERT INTO stock_transactions (
  id, hospital_id, inventory_item_id, transaction_type, quantity, prescription_item_id, performed_by, transaction_at, notes
) VALUES
  -- Apollo Purchases
  ('b000000e-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000001', 'purchase', 5000, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #DL-2024-819, Expiry: Dec 2027 (Micro Labs)'),
  ('b000000e-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000002', 'purchase', 1500, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #AG-2024-102, Expiry: Oct 2026 (GSK)'),
  ('b000000e-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000003', 'purchase', 1000, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #AT-2024-551, Expiry: Mar 2027 (Zydus)'),
  ('b000000e-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000004', 'purchase', 2000, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #GM-2024-301, Expiry: Jan 2027 (USV)'),
  ('b000000e-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000005', 'purchase', 1200, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #TL-2024-419, Expiry: Nov 2026 (Glenmark)'),
  ('b000000e-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000006', 'purchase', 2500, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #PN-2024-902, Expiry: Aug 2027 (Alkem)'),
  ('b000000e-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000007', 'purchase', 1500, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #VV-2024-224, Expiry: May 2027 (Novartis)'),
  ('b000000e-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000008', 'purchase', 150, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #CX-2024-710, Expiry: Dec 2026 (Sanofi)'),
  ('b000000e-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000009', 'purchase', 800, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #NS-2024-118, Expiry: Apr 2028 (Baxter)'),
  ('b000000e-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-00000000000e', 'purchase', 100, null, '80000000-0000-0000-0000-000000000009', now() - interval '60 days', 'Batch #DP-2024-001 (Johnson & Johnson)'),

  -- Apollo Dispensings
  ('b000000e-0000-0000-0000-00000000000b', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000003', 'dispense', -30, 'b0000009-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000009', now() - interval '30 days', 'Dispensed to Rajesh Kumar for cardiology treatment'),
  ('b000000e-0000-0000-0000-00000000000c', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000007', 'dispense', -14, 'b0000009-0000-0000-0000-000000000006', '80000000-0000-0000-0000-000000000009', now() - interval '10 days', 'Dispensed to Murugan V for post-op pain management'),
  ('b000000e-0000-0000-0000-00000000000d', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-000000000004', 'dispense', -60, 'b0000009-0000-0000-0000-00000000000b', '80000000-0000-0000-0000-000000000009', now() - interval '3 days', 'Dispensed to Abdul Rahim for glycemic control'),
  ('b000000e-0000-0000-0000-00000000000e', '11111111-1111-1111-1111-111111111111', 'b000000d-0000-0000-0000-00000000000e', 'dispense', -75, null, '80000000-0000-0000-0000-000000000009', now() - interval '1 day', 'Disbursed to OT & Emergency trauma care. Triggers low stock alert.'),

  -- Demo Hospital Purchases & Dispensings
  ('b000000e-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b000000d-0000-0000-0000-000000000011', 'purchase', 2000, null, '80000000-0000-0000-0001-000000000005', now() - interval '30 days', 'Initial hospital stock purchase'),
  ('b000000e-0000-0000-0000-000000000012', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b000000d-0000-0000-0000-000000000012', 'purchase', 1000, null, '80000000-0000-0000-0001-000000000005', now() - interval '30 days', 'Initial hospital stock purchase'),
  ('b000000e-0000-0000-0000-000000000013', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b000000d-0000-0000-0000-000000000011', 'dispense', -6, 'b0000009-0000-0000-0000-000000000011', '80000000-0000-0000-0001-000000000005', now() - interval '2 days', 'Dispensed to Rajesh Kumar')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 16. INVOICES & INVOICE LINE ITEMS
-- ============================================================================

INSERT INTO invoices (
  id, hospital_id, patient_id, encounter_id, admission_id, invoice_number, status,
  subtotal, cgst_total, sgst_total, discount_amount, total_amount, issued_at, due_at, created_at
) VALUES
  -- 1. Murugan Venkatachalam: TKA Surgery & Stay (Paid)
  ('b000000f-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000003', 'b0000007-0000-0000-0000-000000000002', 'b000000c-0000-0000-0000-000000000001',
   'INV-APO-2026-0001', 'paid', 165000.00, 1200.00, 1200.00, 5000.00, 162400.00, now() - interval '9 days', now() - interval '2 days', now() - interval '9 days'),

  -- 2. Rajesh Kumar Subramanian: CCU Stay & Angiogram (Partially Paid)
  ('b000000f-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000001', 'b000000c-0000-0000-0000-000000000002',
   'INV-APO-2026-0002', 'partially_paid', 215000.00, 1200.00, 1200.00, 0.00, 217400.00, now() - interval '1 day', now() + interval '5 days', now() - interval '1 day'),

  -- 3. Sneha Patel: Dermatology OPD (Paid)
  ('b000000f-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000005', 'b0000007-0000-0000-0000-000000000003', null,
   'INV-APO-2026-0003', 'paid', 1500.00, 36.00, 36.00, 0.00, 1572.00, now() - interval '5 days', now() - interval '5 days', now() - interval '5 days'),

  -- 4. Abdul Rahim Siddiqui: General Ward Stay (Issued)
  ('b000000f-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000006', 'b0000007-0000-0000-0000-000000000004', 'b000000c-0000-0000-0000-000000000003',
   'INV-APO-2026-0004', 'issued', 18500.00, 1080.00, 1080.00, 0.00, 20660.00, now(), now() + interval '3 days', now()),

  -- Demo Hospital Invoice
  ('b000000f-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b0000003-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000011', null,
   'INV-DGH-2026-0001', 'paid', 750.00, 0, 0, 0, 750.00, now() - interval '2 days', now() - interval '2 days', now() - interval '2 days')
ON CONFLICT (hospital_id, invoice_number) DO UPDATE SET
  status = EXCLUDED.status,
  subtotal = EXCLUDED.subtotal,
  cgst_total = EXCLUDED.cgst_total,
  sgst_total = EXCLUDED.sgst_total,
  total_amount = EXCLUDED.total_amount;

INSERT INTO invoice_line_items (
  id, invoice_id, description, hsn_sac_code, quantity, unit_price, gst_rate, cgst_amount, sgst_amount, line_total
) VALUES
  -- Invoice 1: TKA Surgery
  ('b0000010-0000-0000-0000-000000000001', 'b000000f-0000-0000-0000-000000000001', 'Right Total Knee Arthroplasty (Surgery Charges)', '999312', 1, 110000.00, 0, 0, 0, 110000.00),
  ('b0000010-0000-0000-0000-000000000002', 'b000000f-0000-0000-0000-000000000001', 'Semi-Private Ward Stay (5 days @ 2,800/day)', '999311', 5, 2800.00, 0, 0, 0, 14000.00),
  ('b0000010-0000-0000-0000-000000000003', 'b000000f-0000-0000-0000-000000000001', 'Operation Theater & Anesthesia Services', '999312', 1, 25000.00, 0, 0, 0, 25000.00),
  ('b0000010-0000-0000-0000-000000000004', 'b000000f-0000-0000-0000-000000000001', 'Diagnostic Radiology & CBC Workup', '999313', 1, 6000.00, 0, 0, 0, 6000.00),
  ('b0000010-0000-0000-0000-000000000005', 'b000000f-0000-0000-0000-000000000001', 'Post-Op Medicines & Consumables (12% GST)', '3004', 1, 10000.00, 12, 600.00, 600.00, 11200.00),

  -- Invoice 2: CCU & PTCA
  ('b0000010-0000-0000-0000-000000000006', 'b000000f-0000-0000-0000-000000000002', 'Percutaneous Coronary Angioplasty (PTCA) + Stenting', '999312', 1, 150000.00, 0, 0, 0, 150000.00),
  ('b0000010-0000-0000-0000-000000000007', 'b000000f-0000-0000-0000-000000000002', 'Coronary Care Unit (CCU) (4 days @ 7,500/day)', '999311', 4, 7500.00, 0, 0, 0, 30000.00),
  ('b0000010-0000-0000-0000-000000000008', 'b000000f-0000-0000-0000-000000000002', 'Cardiac Catheterization Lab Consumables & Dyes', '999312', 1, 25000.00, 0, 0, 0, 25000.00),
  ('b0000010-0000-0000-0000-000000000009', 'b000000f-0000-0000-0000-000000000002', 'Antiplatelet & Cardiac Emergency Medications', '3004', 1, 10000.00, 12, 600.00, 600.00, 11200.00),

  -- Invoice 3: Dermatology
  ('b0000010-0000-0000-0000-00000000000a', 'b000000f-0000-0000-0000-000000000003', 'Specialist Dermatology Consultation', '999311', 1, 900.00, 0, 0, 0, 900.00),
  ('b0000010-0000-0000-0000-00000000000b', 'b000000f-0000-0000-0000-000000000003', 'Prescription Antihistamines & Creams (12% GST)', '3004', 1, 600.00, 12, 36.00, 36.00, 672.00),

  -- Demo Hospital Invoice Items
  ('b0000010-0000-0000-0000-000000000011', 'b000000f-0000-0000-0000-000000000011', 'General Medicine Consultation Fee', '999311', 1, 600.00, 0, 0, 0, 600.00),
  ('b0000010-0000-0000-0000-000000000012', 'b000000f-0000-0000-0000-000000000011', 'Fasting Blood Sugar Laboratory Test', '999313', 1, 150.00, 0, 0, 0, 150.00)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 17. PAYMENTS
-- ============================================================================

INSERT INTO payments (
  id, hospital_id, invoice_id, amount, payment_method, reference_number, received_by, paid_at, notes
) VALUES
  -- Apollo Payments
  ('b0000011-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b000000f-0000-0000-0000-000000000001', 140000.00, 'netbanking', 'STAR-NEFT-991829', '80000000-0000-0000-0000-000000000021', now() - interval '9 days', 'Cashless insurance settlement from Star Health TPA'),
  ('b0000011-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b000000f-0000-0000-0000-000000000001', 22400.00, 'card', 'POS-HDFC-882910', '80000000-0000-0000-0000-000000000021', now() - interval '9 days', 'Patient co-payment via HDFC Debit Card'),
  ('b0000011-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'b000000f-0000-0000-0000-000000000002', 180000.00, 'netbanking', 'HDFC-ERGO-AUTH-0391', '80000000-0000-0000-0000-000000000021', now() - interval '1 day', 'HDFC ERGO Cashless TPA initial approval received'),
  ('b0000011-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'b000000f-0000-0000-0000-000000000003', 1572.00, 'upi', 'UPI/2026/09/9847192301', '80000000-0000-0000-0000-000000000021', now() - interval '5 days', 'Paid via GooglePay UPI'),

  -- Demo Hospital Payment
  ('b0000011-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'b000000f-0000-0000-0000-000000000011', 750.00, 'upi', 'UPI-DGH-88291039', '80000000-0000-0000-0001-000000000007', now() - interval '2 days', 'Paid via PhonePe QR at cashier')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 18. INSURANCE POLICIES & CLAIMS
-- ============================================================================

INSERT INTO insurance_policies (
  id, patient_id, provider_name, tpa_name, policy_number, valid_from, valid_to, coverage_details, created_at
) VALUES
  ('b0000012-0000-0000-0000-000000000001', 'b0000003-0000-0000-0000-000000000003', 'Star Health and Allied Insurance', 'Medi Assist India TPA Pvt Ltd', 'STAR/MED/2025/0091823', '2025-01-01', '2027-01-01', '{"sum_insured":1000000,"room_rent_limit":"Single Private Room","copay_percentage":0}'::jsonb, now() - interval '1 year'),
  ('b0000012-0000-0000-0000-000000000002', 'b0000003-0000-0000-0000-000000000001', 'HDFC ERGO General Insurance', 'Vidal Health Insurance TPA', 'HDFC-OPT-2024-551029', '2025-06-01', '2027-06-01', '{"sum_insured":1500000,"restoration_benefit":true,"copay_percentage":0}'::jsonb, now() - interval '1 year'),
  ('b0000012-0000-0000-0000-000000000003', 'b0000003-0000-0000-0000-000000000002', 'Care Health Insurance', 'Care Health In-House TPA', 'CARE-FLT-2025-992014', '2025-04-01', '2027-04-01', '{"sum_insured":2500000,"maternity_cover":true}'::jsonb, now() - interval '8 months')
ON CONFLICT (id) DO NOTHING;

INSERT INTO insurance_claims (
  id, hospital_id, invoice_id, insurance_policy_id, claim_number, claim_type, status,
  claimed_amount, approved_amount, handled_by, submitted_at, settled_at, created_at
) VALUES
  -- Settled cashless claim for Murugan V
  ('b0000013-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b000000f-0000-0000-0000-000000000001', 'b0000012-0000-0000-0000-000000000001',
   'CLM-STAR-2026-0819', 'cashless', 'settled', 162400.00, 140000.00, '80000000-0000-0000-0000-000000000021', now() - interval '12 days', now() - interval '9 days', now() - interval '12 days'),

  -- Approved pre-auth claim for Rajesh Kumar
  ('b0000013-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b000000f-0000-0000-0000-000000000002', 'b0000012-0000-0000-0000-000000000002',
   'CLM-HDFC-2026-0391', 'cashless', 'approved', 217400.00, 180000.00, '80000000-0000-0000-0000-000000000021', now() - interval '3 days', null, now() - interval '3 days')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  approved_amount = EXCLUDED.approved_amount;

-- ============================================================================
-- 19. STAFF SHIFTS
-- ============================================================================

INSERT INTO staff_shifts (
  id, hospital_id, membership_id, department_id, shift_date, start_time, end_time, status, notes
) VALUES
  -- Apollo Shifts
  ('b0000014-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', current_date - 2, '08:00:00', '16:00:00', 'completed', 'Cardiology morning OPD and CCU rounds'),
  ('b0000014-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', current_date - 2, '08:00:00', '16:00:00', 'completed', 'Internal Medicine ward shift'),
  ('b0000014-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000009', current_date - 1, '20:00:00', '08:00:00', 'completed', 'ICU night duty shift'),
  ('b0000014-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000002', current_date - 1, '08:00:00', '16:00:00', 'completed', 'OPD reception desk rotation'),
  ('b0000014-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', current_date, '08:00:00', '16:00:00', 'scheduled', 'Cath Lab and CCU duty'),
  ('b0000014-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003', current_date, '09:00:00', '17:00:00', 'scheduled', 'Orthopedics surgery list'),
  ('b0000014-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000002', current_date, '08:00:00', '16:00:00', 'scheduled', 'General ward morning nursing station'),
  ('b0000014-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', current_date + 1, '08:00:00', '16:00:00', 'scheduled', 'Internal medicine OPD morning'),
  ('b0000014-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '80000000-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004', current_date + 1, '09:00:00', '17:00:00', 'scheduled', 'Pediatrics OPD clinic'),

  -- Demo Hospital Shift
  ('b0000014-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', '80000000-0000-0000-0001-000000000001', 'b0000001-0000-0000-0000-000000000012', current_date, '09:00:00', '17:00:00', 'scheduled', 'General OPD shift')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 20. BIOMETRIC DEVICES, PIN MAPPINGS & ATTENDANCE RECORDS
-- ============================================================================

INSERT INTO biometric_devices (
  id, hospital_id, serial_number, name, location, model, ip_address, firmware_version, status, last_sync_at
) VALUES
  ('b0000015-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'ESSL-SB101-2024-0819', 'Main Entrance Biometric Access', 'Ground Floor Main Lobby', 'eSSL SilkBio-101TC', '192.168.1.201', 'Ver 6.8.0-2024', 'active', now() - interval '5 minutes'),
  ('b0000015-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'ZK-MB20-2024-0552', 'Doctors Lounge & Medical Records', '2nd Floor Doctors Station', 'ZKTeco MB20 Face & Bio', '192.168.1.202', 'ZKFinger VX10.0', 'active', now() - interval '8 minutes'),
  ('b0000015-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'MAN-BS3-2024-0199', 'Emergency Triage & ICU Access', 'Emergency Wing Ground Floor', 'Mantra BioStation 3', '192.168.1.203', 'MFS500-V4.2', 'active', now() - interval '12 minutes'),
  ('b0000015-0000-0000-0000-000000000011', 'd444bfba-c334-4e79-9d45-7d8ab5471e22', 'ESSL-DGH-2024-001', 'Main Reception Bio Device', 'Ground Floor Reception', 'eSSL K30 Pro', '192.168.2.10', 'Ver 1.2', 'active', now() - interval '10 minutes')
ON CONFLICT (serial_number) DO UPDATE SET
  status = EXCLUDED.status,
  last_sync_at = EXCLUDED.last_sync_at;

INSERT INTO employee_pin_mappings (id, hospital_id, user_id, biometric_pin)
VALUES
  ('b0000016-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000001', '1001'),
  ('b0000016-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000002', '1002'),
  ('b0000016-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000006', '2001'),
  ('b0000016-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000008', '3001')
ON CONFLICT (hospital_id, user_id) DO NOTHING;

INSERT INTO attendance_records (
  id, hospital_id, user_id, check_in_time, check_out_time, status, source, device_id, verify_mode, notes
) VALUES
  ('b0000017-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000001',
   date_trunc('day', now()) - interval '1 day' + interval '7 hours 55 minutes',
   date_trunc('day', now()) - interval '1 day' + interval '16 hours 10 minutes',
   'present', 'biometric', 'b0000015-0000-0000-0000-000000000002', 1, 'Fingerprint verified on Doctors Lounge terminal'),

  ('b0000017-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000006',
   date_trunc('day', now()) - interval '1 day' + interval '19 hours 50 minutes',
   date_trunc('day', now()) + interval '8 hours 05 minutes',
   'present', 'biometric', 'b0000015-0000-0000-0000-000000000003', 2, 'Facial recognition verified at Emergency & ICU terminal'),

  ('b0000017-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000001',
   date_trunc('day', now()) + interval '7 hours 58 minutes',
   null,
   'checked_in', 'biometric', 'b0000015-0000-0000-0000-000000000002', 1, 'Today morning check-in. In progress.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 21. LEAVE MANAGEMENT
-- ============================================================================

INSERT INTO leave_balances (
  id, hospital_id, user_id, year, casual_leave, sick_leave, earned_leave
) VALUES
  ('b0000018-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000001', 2026, 10, 12, 15),
  ('b0000018-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000002', 2026, 12, 12, 15),
  ('b0000018-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000006', 2026, 11, 10, 14),
  ('b0000018-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000008', 2026, 9, 12, 15)
ON CONFLICT (hospital_id, user_id, year) DO NOTHING;

INSERT INTO leave_applications (
  id, hospital_id, user_id, leave_type, start_date, end_date, days_count, reason, status, approved_by, approved_at
) VALUES
  ('b0000019-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000001',
   'casual', current_date - 15, current_date - 14, 2, 'Attending Cardiological Society of India (CSI) Annual Conference', 'approved', '3d7bb07c-4078-46f1-99f9-f168a2c004b5', now() - interval '16 days'),
  ('b0000019-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000006',
   'sick', current_date - 8, current_date - 7, 2, 'Acute gastroenteritis and dehydration', 'approved', '3d7bb07c-4078-46f1-99f9-f168a2c004b5', now() - interval '8 days'),
  ('b0000019-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000008',
   'casual', current_date + 5, current_date + 7, 3, 'Family wedding ceremony', 'pending', null, null)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

-- ============================================================================
-- 22. ABDM INTEGRATION
-- ============================================================================

INSERT INTO abdm_link_requests (
  id, hospital_id, patient_id, link_type, abdm_request_id, status, initiated_at, resolved_at
) VALUES
  ('b000001a-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000001',
   'care_context', 'ABDM-REQ-2026-99104', 'confirmed', now() - interval '30 days', now() - interval '30 days' + interval '3 minutes'),
  ('b000001a-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000003',
   'care_context', 'ABDM-REQ-2026-99215', 'confirmed', now() - interval '14 days', now() - interval '14 days' + interval '2 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO abdm_consent_artifacts (
  id, hospital_id, patient_id, purpose, hiu_id, consent_request_id, artifact_id, status, requested_at, resolved_at, hiu_public_key
) VALUES
  ('b000001b-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000003-0000-0000-0000-000000000001',
   'CARESHARE', 'APOLLO-HIU-CHN-01', 'REQ-CONSENT-99182', 'ART-CONSENT-99182-V1', 'granted', now() - interval '25 days', now() - interval '25 days' + interval '10 minutes', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...')
ON CONFLICT (id) DO NOTHING;

INSERT INTO abdm_callback_log (
  id, callback_type, abdm_request_id, payload, received_at
) VALUES
  ('b000001c-0000-0000-0000-000000000001', 'v0.5/users/auth/on-confirm', 'ABDM-REQ-2026-99104', '{"status":"SUCCESS","auth":{"accessToken":"eyJhbGciOi...","validity":"2026-10-31"}}'::jsonb, now() - interval '30 days'),
  ('b000001c-0000-0000-0000-000000000002', 'v0.5/links/link/on-confirm', 'ABDM-REQ-2026-99215', '{"status":"SUCCESS","patient":{"referenceNumber":"APO-2024-00103","careContexts":[{"referenceNumber":"enc22222"}]}}'::jsonb, now() - interval '14 days')
ON CONFLICT (id) DO NOTHING;
