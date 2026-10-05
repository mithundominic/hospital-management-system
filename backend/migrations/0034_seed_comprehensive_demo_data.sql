-- 0034_seed_comprehensive_demo_data.sql
-- Comprehensive realistic demo data for all hospital management sections
-- Data sourced from real Indian hospital names and medical patterns
-- Purpose: Enable complete testing and demonstration of all features

-- ============================================================================
-- SECTION 1: HOSPITALS
-- ============================================================================
-- Using real hospital names from India (content rephrased for compliance)

INSERT INTO hospitals (id, name, registration_number, address, city, state, pincode, is_active, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Apollo Hospitals', 'REG-APO-2024-001', '21 Greams Lane, Off Greams Road', 'Chennai', 'Tamil Nadu', '600006', true, NOW() - INTERVAL '2 years'),
  ('22222222-2222-2222-2222-222222222222', 'Fortis Memorial Research Institute', 'REG-FOR-2024-002', 'Sector 44, Opposite HUDA City Centre', 'Gurugram', 'Haryana', '122002', true, NOW() - INTERVAL '18 months'),
  ('33333333-3333-3333-3333-333333333333', 'Narayana Multispeciality Hospital', 'REG-NAR-2024-003', 'Hosur Road, Bommasandra', 'Bengaluru', 'Karnataka', '560099', true, NOW() - INTERVAL '1 year');

-- ============================================================================
-- SECTION 2: STAFF & DOCTORS
-- ============================================================================
-- Realistic Indian names and specializations

-- Doctors
INSERT INTO doctor_profiles (id, user_id, hospital_id, specialization, qualification, registration_number, years_of_experience, consultation_fee, is_available, created_at)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'admin', '11111111-1111-1111-1111-111111111111', 'Cardiology', 'MBBS, MD, DM (Cardiology)', 'MCI-12345', 15, 1500.00, true, NOW() - INTERVAL '2 years'),
  ('d2222222-2222-2222-2222-222222222222', 'admin', '11111111-1111-1111-1111-111111111111', 'Orthopedics', 'MBBS, MS (Ortho)', 'MCI-12346', 12, 1200.00, true, NOW() - INTERVAL '2 years'),
  ('d3333333-3333-3333-3333-333333333333', 'admin', '11111111-1111-1111-1111-111111111111', 'Pediatrics', 'MBBS, MD (Pediatrics)', 'MCI-12347', 10, 1000.00, true, NOW() - INTERVAL '18 months'),
  ('d4444444-4444-4444-4444-444444444444', 'admin', '11111111-1111-1111-1111-111111111111', 'General Medicine', 'MBBS, MD', 'MCI-12348', 8, 800.00, true, NOW() - INTERVAL '1 year'),
  ('d5555555-5555-5555-5555-555555555555', 'admin', '11111111-1111-1111-1111-111111111111', 'Dermatology', 'MBBS, MD (Dermatology)', 'MCI-12349', 7, 900.00, true, NOW() - INTERVAL '1 year');

-- Departments
INSERT INTO departments (id, hospital_id, name, head_doctor_id, created_at)
VALUES
  ('dept1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cardiology', 'd1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 years'),
  ('dept2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Orthopedics', 'd2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 years'),
  ('dept3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Pediatrics', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '18 months'),
  ('dept4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'General Medicine', 'd4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '1 year'),
  ('dept5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Dermatology', 'd5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '1 year');

-- ============================================================================
-- SECTION 3: PATIENTS
-- ============================================================================
-- Common Indian patient names with realistic demographics

INSERT INTO patients (id, abha_number, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, pincode, blood_group, emergency_contact_name, emergency_contact_phone, created_at)
VALUES
  ('p1111111-1111-1111-1111-111111111111', '12-3456-7890-1234', 'Rajesh', 'Kumar', '1985-03-15', 'male', '9876543210', 'rajesh.kumar@email.com', '123 MG Road', 'Chennai', 'Tamil Nadu', '600001', 'O+', 'Priya Kumar', '9876543211', NOW() - INTERVAL '2 years'),
  ('p2222222-2222-2222-2222-222222222222', '12-3456-7890-1235', 'Priya', 'Sharma', '1990-07-22', 'female', '9876543212', 'priya.sharma@email.com', '456 Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'A+', 'Amit Sharma', '9876543213', NOW() - INTERVAL '2 years'),
  ('p3333333-3333-3333-3333-333333333333', '12-3456-7890-1236', 'Amit', 'Patel', '1978-11-30', 'male', '9876543214', 'amit.patel@email.com', '789 T Nagar', 'Chennai', 'Tamil Nadu', '600017', 'B+', 'Neha Patel', '9876543215', NOW() - INTERVAL '18 months'),
  ('p4444444-4444-4444-4444-444444444444', '12-3456-7890-1237', 'Sneha', 'Reddy', '1995-05-18', 'female', '9876543216', 'sneha.reddy@email.com', '321 Adyar', 'Chennai', 'Tamil Nadu', '600020', 'AB+', 'Karthik Reddy', '9876543217', NOW() - INTERVAL '1 year'),
  ('p5555555-5555-5555-5555-555555555555', '12-3456-7890-1238', 'Karthik', 'Iyer', '1982-09-25', 'male', '9876543218', 'karthik.iyer@email.com', '654 Mylapore', 'Chennai', 'Tamil Nadu', '600004', 'O-', 'Lakshmi Iyer', '9876543219', NOW() - INTERVAL '1 year'),
  ('p6666666-6666-6666-6666-666666666666', '12-3456-7890-1239', 'Ananya', 'Singh', '2015-01-10', 'female', '9876543220', 'parent.singh@email.com', '987 Velachery', 'Chennai', 'Tamil Nadu', '600042', 'A-', 'Vikram Singh', '9876543221', NOW() - INTERVAL '6 months'),
  ('p7777777-7777-7777-7777-777777777777', '12-3456-7890-1240', 'Vikram', 'Mehta', '1970-12-05', 'male', '9876543222', 'vikram.mehta@email.com', '147 Nungambakkam', 'Chennai', 'Tamil Nadu', '600034', 'B-', 'Anjali Mehta', '9876543223', NOW() - INTERVAL '6 months'),
  ('p8888888-8888-8888-8888-888888888888', '12-3456-7890-1241', 'Divya', 'Nair', '1988-04-14', 'female', '9876543224', 'divya.nair@email.com', '258 Porur', 'Chennai', 'Tamil Nadu', '600116', 'O+', 'Arun Nair', '9876543225', NOW() - INTERVAL '3 months'),
  ('p9999999-9999-9999-9999-999999999999', '12-3456-7890-1242', 'Arun', 'Desai', '1993-08-20', 'male', '9876543226', 'arun.desai@email.com', '369 Besant Nagar', 'Chennai', 'Tamil Nadu', '600090', 'A+', 'Meera Desai', '9876543227', NOW() - INTERVAL '3 months'),
  ('pa111111-1111-1111-1111-111111111111', '12-3456-7890-1243', 'Meera', 'Kapoor', '2018-06-15', 'female', '9876543228', 'parent.kapoor@email.com', '741 Tambaram', 'Chennai', 'Tamil Nadu', '600045', 'B+', 'Rahul Kapoor', '9876543229', NOW() - INTERVAL '2 months');

-- Patient Registrations (linking patients to hospital)
INSERT INTO patient_registrations (id, patient_id, hospital_id, registration_number, registration_date, created_at)
VALUES
  ('pr111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0001', NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 years'),
  ('pr222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0002', NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 years'),
  ('pr333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0003', NOW() - INTERVAL '18 months', NOW() - INTERVAL '18 months'),
  ('pr444444-4444-4444-4444-444444444444', 'p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0004', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 year'),
  ('pr555555-5555-5555-5555-555555555555', 'p5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0005', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 year'),
  ('pr666666-6666-6666-6666-666666666666', 'p6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0006', NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months'),
  ('pr777777-7777-7777-7777-777777777777', 'p7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0007', NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months'),
  ('pr888888-8888-8888-8888-888888888888', 'p8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0008', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
  ('pr999999-9999-9999-9999-999999999999', 'p9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0009', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
  ('pra11111-1111-1111-1111-111111111111', 'pa111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'APO-PAT-2024-0010', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months');

-- ============================================================================
-- SECTION 4: APPOINTMENTS
-- ============================================================================
-- Various appointment statuses and time slots

INSERT INTO appointments (id, hospital_id, patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes, created_at)
VALUES
  ('apt11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE - 30, '10:00:00', 'completed', 'Chest pain and palpitations', 'Follow-up needed in 2 weeks', NOW() - INTERVAL '30 days'),
  ('apt22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', CURRENT_DATE - 15, '11:30:00', 'completed', 'Child vaccination checkup', 'All vitals normal', NOW() - INTERVAL '15 days'),
  ('apt33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', CURRENT_DATE - 7, '14:00:00', 'completed', 'Knee pain', 'X-ray ordered', NOW() - INTERVAL '7 days'),
  ('apt44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 'd5555555-5555-5555-5555-555555555555', CURRENT_DATE - 3, '15:30:00', 'completed', 'Skin rash', 'Prescribed ointment', NOW() - INTERVAL '3 days'),
  ('apt55555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'p5555555-5555-5555-5555-555555555555', 'd4444444-4444-4444-4444-444444444444', CURRENT_DATE, '10:30:00', 'confirmed', 'Regular checkup', NULL, NOW() - INTERVAL '2 days'),
  ('apt66666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'p6666666-6666-6666-6666-666666666666', 'd3333333-3333-3333-3333-333333333333', CURRENT_DATE + 1, '09:00:00', 'confirmed', 'Fever and cough', NULL, NOW() - INTERVAL '1 day'),
  ('apt77777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'p7777777-7777-7777-7777-777777777777', 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE + 2, '16:00:00', 'scheduled', 'Heart checkup', NULL, NOW()),
  ('apt88888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'p8888888-8888-8888-8888-888888888888', 'd4444444-4444-4444-4444-444444444444', CURRENT_DATE + 3, '11:00:00', 'scheduled', 'General consultation', NULL, NOW()),
  ('apt99999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'p9999999-9999-9999-9999-999999999999', 'd5555555-5555-5555-5555-555555555555', CURRENT_DATE - 20, '13:00:00', 'cancelled', 'Acne treatment', 'Patient requested cancellation', NOW() - INTERVAL '20 days');

-- ============================================================================
-- SECTION 5: ENCOUNTERS & PRESCRIPTIONS
-- ============================================================================

-- Encounters
INSERT INTO encounters (id, hospital_id, patient_id, doctor_id, appointment_id, encounter_date, encounter_type, chief_complaint, diagnosis, treatment_plan, vitals, notes, status, created_at)
VALUES
  ('enc11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'apt11111-1111-1111-1111-111111111111', CURRENT_DATE - 30, 'opd', 'Chest pain and palpitations', 'Angina pectoris', 'Medications and lifestyle modifications', '{"bp": "140/90", "pulse": "88", "temp": "98.6", "weight": "75"}', 'ECG showed mild abnormalities', 'finalized', NOW() - INTERVAL '30 days'),
  ('enc22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'apt22222-2222-2222-2222-222222222222', CURRENT_DATE - 15, 'opd', 'Vaccination visit', 'Healthy child checkup', 'Administered DPT booster', '{"height": "110cm", "weight": "18kg", "temp": "98.4"}', 'Next vaccination due in 6 months', 'finalized', NOW() - INTERVAL '15 days'),
  ('enc33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 'apt33333-3333-3333-3333-333333333333', CURRENT_DATE - 7, 'opd', 'Knee pain', 'Osteoarthritis - Grade 2', 'Pain management and physiotherapy', '{"bp": "130/85", "pulse": "76", "temp": "98.5", "weight": "82"}', 'X-ray shows cartilage degeneration', 'finalized', NOW() - INTERVAL '7 days'),
  ('enc44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 'd5555555-5555-5555-5555-555555555555', 'apt44444-4444-4444-4444-444444444444', CURRENT_DATE - 3, 'opd', 'Skin rash on arms', 'Contact dermatitis', 'Topical corticosteroids and antihistamines', '{"bp": "120/80", "pulse": "72", "temp": "98.6", "weight": "60"}', 'Advised to avoid allergens', 'finalized', NOW() - INTERVAL '3 days');

-- Prescriptions
INSERT INTO prescriptions (id, hospital_id, encounter_id, patient_id, doctor_id, prescription_date, notes, created_at)
VALUES
  ('prx11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'enc11111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE - 30, 'Take medications after meals', NOW() - INTERVAL '30 days'),
  ('prx22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'enc33333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', CURRENT_DATE - 7, 'Complete the course', NOW() - INTERVAL '7 days'),
  ('prx33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'enc44444-4444-4444-4444-444444444444', 'p4444444-4444-4444-4444-444444444444', 'd5555555-5555-5555-5555-555555555555', CURRENT_DATE - 3, 'Apply ointment twice daily', NOW() - INTERVAL '3 days');

-- Prescription Items
INSERT INTO prescription_items (id, prescription_id, medication_name, dosage, frequency, duration, quantity, instructions, created_at)
VALUES
  -- Prescription 1 items
  ('prxi1111-1111-1111-1111-111111111111', 'prx11111-1111-1111-1111-111111111111', 'Atorvastatin', '20mg', 'Once daily', '30 days', 30, 'Take at bedtime', NOW() - INTERVAL '30 days'),
  ('prxi1112-1111-1111-1111-111111111111', 'prx11111-1111-1111-1111-111111111111', 'Aspirin', '75mg', 'Once daily', '30 days', 30, 'Take after breakfast', NOW() - INTERVAL '30 days'),
  ('prxi1113-1111-1111-1111-111111111111', 'prx11111-1111-1111-1111-111111111111', 'Metoprolol', '25mg', 'Twice daily', '30 days', 60, 'Morning and evening', NOW() - INTERVAL '30 days'),
  -- Prescription 2 items
  ('prxi2221-1111-1111-1111-111111111111', 'prx22222-2222-2222-2222-222222222222', 'Diclofenac', '50mg', 'Twice daily', '7 days', 14, 'After meals', NOW() - INTERVAL '7 days'),
  ('prxi2222-1111-1111-1111-111111111111', 'prx22222-2222-2222-2222-222222222222', 'Calcium + Vitamin D3', '500mg', 'Once daily', '30 days', 30, 'After breakfast', NOW() - INTERVAL '7 days'),
  -- Prescription 3 items
  ('prxi3331-1111-1111-1111-111111111111', 'prx33333-3333-3333-3333-333333333333', 'Betamethasone cream', '0.1%', 'Twice daily', '14 days', 1, 'Apply thin layer', NOW() - INTERVAL '3 days'),
  ('prxi3332-1111-1111-1111-111111111111', 'prx33333-3333-3333-3333-333333333333', 'Cetirizine', '10mg', 'Once daily', '14 days', 14, 'Take at bedtime', NOW() - INTERVAL '3 days');

-- ============================================================================
-- SECTION 6: LAB ORDERS & RESULTS
-- ============================================================================

-- Lab Orders
INSERT INTO lab_orders (id, hospital_id, patient_id, doctor_id, encounter_id, test_name, test_category, priority, status, notes, ordered_date, created_at)
VALUES
  ('lab11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'enc11111-1111-1111-1111-111111111111', 'Lipid Profile', 'Biochemistry', 'routine', 'completed', 'Fasting sample required', CURRENT_DATE - 30, NOW() - INTERVAL '30 days'),
  ('lab22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'enc11111-1111-1111-1111-111111111111', 'ECG', 'Cardiology', 'routine', 'completed', NULL, CURRENT_DATE - 30, NOW() - INTERVAL '30 days'),
  ('lab33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 'enc33333-3333-3333-3333-333333333333', 'X-Ray Knee AP/Lateral', 'Radiology', 'routine', 'completed', 'Both knees', CURRENT_DATE - 7, NOW() - INTERVAL '7 days'),
  ('lab44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'enc22222-2222-2222-2222-222222222222', 'Complete Blood Count', 'Hematology', 'routine', 'completed', NULL, CURRENT_DATE - 15, NOW() - INTERVAL '15 days'),
  ('lab55555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'p5555555-5555-5555-5555-555555555555', 'd4444444-4444-4444-4444-444444444444', NULL, 'Blood Sugar Fasting', 'Biochemistry', 'routine', 'pending', 'Regular health checkup', CURRENT_DATE, NOW()),
  ('lab66666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'p7777777-7777-7777-7777-777777777777', 'd1111111-1111-1111-1111-111111111111', NULL, 'Cardiac Enzymes', 'Biochemistry', 'urgent', 'in_progress', 'Suspected MI', CURRENT_DATE, NOW());

-- Lab Results
INSERT INTO lab_results (id, lab_order_id, test_name, result_value, unit, reference_range, status, result_date, verified_by, notes, created_at)
VALUES
  -- Lipid Profile
  ('res11111-1111-1111-1111-111111111111', 'lab11111-1111-1111-1111-111111111111', 'Total Cholesterol', '245', 'mg/dL', '< 200', 'abnormal', CURRENT_DATE - 29, 'admin', 'Elevated', NOW() - INTERVAL '29 days'),
  ('res11112-1111-1111-1111-111111111111', 'lab11111-1111-1111-1111-111111111111', 'LDL Cholesterol', '160', 'mg/dL', '< 100', 'abnormal', CURRENT_DATE - 29, 'admin', 'High', NOW() - INTERVAL '29 days'),
  ('res11113-1111-1111-1111-111111111111', 'lab11111-1111-1111-1111-111111111111', 'HDL Cholesterol', '38', 'mg/dL', '> 40', 'abnormal', CURRENT_DATE - 29, 'admin', 'Low', NOW() - INTERVAL '29 days'),
  ('res11114-1111-1111-1111-111111111111', 'lab11111-1111-1111-1111-111111111111', 'Triglycerides', '210', 'mg/dL', '< 150', 'abnormal', CURRENT_DATE - 29, 'admin', 'Elevated', NOW() - INTERVAL '29 days'),
  -- ECG
  ('res22221-1111-1111-1111-111111111111', 'lab22222-2222-2222-2222-222222222222', 'ECG', 'Sinus rhythm with occasional PVCs', NULL, 'Normal sinus rhythm', 'normal', CURRENT_DATE - 29, 'admin', NULL, NOW() - INTERVAL '29 days'),
  -- X-Ray
  ('res33331-1111-1111-1111-111111111111', 'lab33333-3333-3333-3333-333333333333', 'X-Ray Knee', 'Joint space narrowing, osteophyte formation', NULL, NULL, 'abnormal', CURRENT_DATE - 6, 'admin', 'Grade 2 osteoarthritis', NOW() - INTERVAL '6 days'),
  -- CBC
  ('res44441-1111-1111-1111-111111111111', 'lab44444-4444-4444-4444-444444444444', 'Hemoglobin', '12.5', 'g/dL', '12-16 (F)', 'normal', CURRENT_DATE - 14, 'admin', NULL, NOW() - INTERVAL '14 days'),
  ('res44442-1111-1111-1111-111111111111', 'lab44444-4444-4444-4444-444444444444', 'WBC Count', '8500', '/µL', '4000-11000', 'normal', CURRENT_DATE - 14, 'admin', NULL, NOW() - INTERVAL '14 days'),
  ('res44443-1111-1111-1111-111111111111', 'lab44444-4444-4444-4444-444444444444', 'Platelet Count', '250000', '/µL', '150000-450000', 'normal', CURRENT_DATE - 14, 'admin', NULL, NOW() - INTERVAL '14 days');

-- ============================================================================
-- SECTION 7: IPD - BEDS & ADMISSIONS
-- ============================================================================

-- Beds
INSERT INTO beds (id, hospital_id, bed_number, ward_name, bed_type, floor, status, daily_rate, created_at)
VALUES
  ('bed11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '101', 'General Ward', 'general', '1', 'available', 1500.00, NOW() - INTERVAL '2 years'),
  ('bed22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '102', 'General Ward', 'general', '1', 'occupied', 1500.00, NOW() - INTERVAL '2 years'),
  ('bed33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '103', 'General Ward', 'general', '1', 'available', 1500.00, NOW() - INTERVAL '2 years'),
  ('bed44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '201', 'ICU', 'icu', '2', 'occupied', 5000.00, NOW() - INTERVAL '2 years'),
  ('bed55555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '202', 'ICU', 'icu', '2', 'available', 5000.00, NOW() - INTERVAL '2 years'),
  ('bed66666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '301', 'Private Ward', 'private', '3', 'available', 3000.00, NOW() - INTERVAL '2 years'),
  ('bed77777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', '302', 'Private Ward', 'private', '3', 'occupied', 3000.00, NOW() - INTERVAL '2 years'),
  ('bed88888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', '303', 'Private Ward', 'private', '3', 'maintenance', 3000.00, NOW() - INTERVAL '2 years');

-- Admissions
INSERT INTO admissions (id, hospital_id, patient_id, bed_id, doctor_id, admission_date, discharge_date, admission_type, reason, diagnosis, status, notes, created_at)
VALUES
  ('adm11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'bed44444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE - 5, NULL, 'emergency', 'Acute chest pain', 'Unstable angina', 'admitted', 'Under observation', NOW() - INTERVAL '5 days'),
  ('adm22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'bed77777-7777-7777-7777-777777777777', 'd2222222-2222-2222-2222-222222222222', CURRENT_DATE - 10, CURRENT_DATE - 3, 'planned', 'Knee replacement surgery', 'Severe osteoarthritis', 'discharged', 'Surgery successful', NOW() - INTERVAL '10 days'),
  ('adm33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'p8888888-8888-8888-8888-888888888888', 'bed22222-2222-2222-2222-222222222222', 'd4444444-4444-4444-4444-444444444444', CURRENT_DATE - 2, NULL, 'emergency', 'High fever and dehydration', 'Viral fever', 'admitted', 'IV fluids started', NOW() - INTERVAL '2 days');

-- ============================================================================
-- SECTION 8: PHARMACY INVENTORY
-- ============================================================================

INSERT INTO inventory_items (id, hospital_id, item_name, item_category, item_type, unit_of_measure, reorder_level, unit_price, supplier_name, description, created_at)
VALUES
  ('inv11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Paracetamol 500mg', 'Medications', 'medicine', 'Tablets', 500, 2.50, 'Cipla Pharmaceuticals', 'Fever and pain relief', NOW() - INTERVAL '2 years'),
  ('inv22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Amoxicillin 500mg', 'Medications', 'medicine', 'Capsules', 300, 8.00, 'Sun Pharma', 'Antibiotic', NOW() - INTERVAL '2 years'),
  ('inv33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Atorvastatin 20mg', 'Medications', 'medicine', 'Tablets', 200, 12.00, 'Dr. Reddy\'s', 'Cholesterol medication', NOW() - INTERVAL '2 years'),
  ('inv44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Metformin 500mg', 'Medications', 'medicine', 'Tablets', 400, 3.50, 'Lupin Ltd', 'Diabetes medication', NOW() - INTERVAL '2 years'),
  ('inv55555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Surgical Gloves (Pair)', 'Supplies', 'consumable', 'Pairs', 1000, 15.00, 'Kimberly-Clark', 'Latex surgical gloves', NOW() - INTERVAL '2 years'),
  ('inv66666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Disposable Syringes 5ml', 'Supplies', 'consumable', 'Pieces', 2000, 3.00, 'BD India', 'Single use syringes', NOW() - INTERVAL '2 years'),
  ('inv77777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Bandage Roll 6cm', 'Supplies', 'consumable', 'Rolls', 500, 20.00, 'Johnson & Johnson', 'Cotton bandage', NOW() - INTERVAL '2 years'),
  ('inv88888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Betadine Solution 100ml', 'Medications', 'medicine', 'Bottles', 100, 85.00, 'Win-Medicare', 'Antiseptic solution', NOW() - INTERVAL '2 years'),
  ('inv99999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'IV Fluid (Normal Saline)', 'Supplies', 'consumable', 'Bottles', 300, 45.00, 'Baxter India', '500ml NS bottles', NOW() - INTERVAL '2 years'),
  ('inva1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Aspirin 75mg', 'Medications', 'medicine', 'Tablets', 250, 1.50, 'Bayer India', 'Blood thinner', NOW() - INTERVAL '2 years');

-- Stock Transactions (Opening Stock)
INSERT INTO stock_transactions (id, hospital_id, inventory_item_id, transaction_type, quantity, unit_price, total_amount, reference_number, transaction_date, notes, created_by, created_at)
VALUES
  ('stk11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'inv11111-1111-1111-1111-111111111111', 'purchase', 2000, 2.50, 5000.00, 'PO-2024-001', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'inv22222-2222-2222-2222-222222222222', 'purchase', 1000, 8.00, 8000.00, 'PO-2024-002', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'inv33333-3333-3333-3333-333333333333', 'purchase', 800, 12.00, 9600.00, 'PO-2024-003', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'inv44444-4444-4444-4444-444444444444', 'purchase', 1500, 3.50, 5250.00, 'PO-2024-004', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk55555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'inv55555-5555-5555-5555-555555555555', 'purchase', 5000, 15.00, 75000.00, 'PO-2024-005', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk66666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'inv66666-6666-6666-6666-666666666666', 'purchase', 10000, 3.00, 30000.00, 'PO-2024-006', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk77777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'inv77777-7777-7777-7777-777777777777', 'purchase', 2000, 20.00, 40000.00, 'PO-2024-007', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk88888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'inv88888-8888-8888-8888-888888888888', 'purchase', 500, 85.00, 42500.00, 'PO-2024-008', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stk99999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'inv99999-9999-9999-9999-999999999999', 'purchase', 1000, 45.00, 45000.00, 'PO-2024-009', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  ('stka1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'inva1111-1111-1111-1111-111111111111', 'purchase', 1000, 1.50, 1500.00, 'PO-2024-010', CURRENT_DATE - 90, 'Opening stock', 'admin', NOW() - INTERVAL '90 days'),
  -- Some dispensing transactions
  ('stkd1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'inv11111-1111-1111-1111-111111111111', 'dispense', -500, 2.50, -1250.00, 'DISP-001', CURRENT_DATE - 30, 'Dispensed to patients', 'admin', NOW() - INTERVAL '30 days'),
  ('stkd2222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'inv33333-3333-3333-3333-333333333333', 'dispense', -90, 12.00, -1080.00, 'DISP-002', CURRENT_DATE - 30, 'Prescription fulfillment', 'admin', NOW() - INTERVAL '30 days'),
  ('stkd3333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'inv55555-5555-5555-5555-555555555555', 'dispense', -1200, 15.00, -18000.00, 'DISP-003', CURRENT_DATE - 15, 'Surgery consumption', 'admin', NOW() - INTERVAL '15 days');

-- ============================================================================
-- SECTION 9: BILLING & INSURANCE
-- ============================================================================

-- Insurance Policies
INSERT INTO insurance_policies (id, patient_id, policy_number, provider_name, policy_type, coverage_amount, premium_amount, start_date, end_date, status, beneficiary_name, beneficiary_relationship, created_at)
VALUES
  ('ins11111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'HDFC-HEALTH-123456', 'HDFC ERGO', 'health', 500000.00, 12000.00, CURRENT_DATE - 365, CURRENT_DATE + 365, 'active', 'Rajesh Kumar', 'self', NOW() - INTERVAL '1 year'),
  ('ins22222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 'STAR-FAM-789012', 'Star Health Insurance', 'health', 300000.00, 15000.00, CURRENT_DATE - 200, CURRENT_DATE + 565, 'active', 'Priya Sharma', 'self', NOW() - INTERVAL '200 days'),
  ('ins33333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 'MAX-BUPA-345678', 'Max Bupa', 'health', 1000000.00, 25000.00, CURRENT_DATE - 180, CURRENT_DATE + 545, 'active', 'Amit Patel', 'self', NOW() - INTERVAL '180 days');

-- Invoices
INSERT INTO invoices (id, hospital_id, patient_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, status, payment_terms, notes, created_at)
VALUES
  ('inv11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'INV-2024-001', CURRENT_DATE - 29, CURRENT_DATE - 22, 3200.00, 576.00, 0.00, 3776.00, 'paid', 'Due on receipt', 'OPD consultation charges', NOW() - INTERVAL '29 days'),
  ('inv22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'INV-2024-002', CURRENT_DATE - 14, CURRENT_DATE - 7, 1500.00, 270.00, 150.00, 1620.00, 'paid', 'Due on receipt', 'Pediatric checkup', NOW() - INTERVAL '14 days'),
  ('inv33333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'INV-2024-003', CURRENT_DATE - 3, CURRENT_DATE + 4, 45000.00, 8100.00, 5000.00, 48100.00, 'partial', 'Due on receipt', 'Knee surgery and hospitalization', NOW() - INTERVAL '3 days'),
  ('inv44444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 'INV-2024-004', CURRENT_DATE - 3, CURRENT_DATE + 4, 1500.00, 270.00, 0.00, 1770.00, 'paid', 'Due on receipt', 'Dermatology consultation', NOW() - INTERVAL '3 days'),
  ('inv55555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'INV-2024-005', CURRENT_DATE - 4, CURRENT_DATE + 3, 28000.00, 5040.00, 0.00, 33040.00, 'pending', 'Due on receipt', 'ICU charges', NOW() - INTERVAL '4 days');

-- Invoice Line Items
INSERT INTO invoice_line_items (id, invoice_id, description, item_type, quantity, unit_price, amount, created_at)
VALUES
  -- Invoice 1 items
  ('ili11111-1111-1111-1111-111111111111', 'inv11111-1111-1111-1111-111111111111', 'Cardiology Consultation', 'consultation', 1, 1500.00, 1500.00, NOW() - INTERVAL '29 days'),
  ('ili11112-1111-1111-1111-111111111111', 'inv11111-1111-1111-1111-111111111111', 'ECG', 'diagnostic', 1, 500.00, 500.00, NOW() - INTERVAL '29 days'),
  ('ili11113-1111-1111-1111-111111111111', 'inv11111-1111-1111-1111-111111111111', 'Lipid Profile', 'diagnostic', 1, 1200.00, 1200.00, NOW() - INTERVAL '29 days'),
  -- Invoice 2 items
  ('ili22221-1111-1111-1111-111111111111', 'inv22222-2222-2222-2222-222222222222', 'Pediatric Consultation', 'consultation', 1, 1000.00, 1000.00, NOW() - INTERVAL '14 days'),
  ('ili22222-1111-1111-1111-111111111111', 'inv22222-2222-2222-2222-222222222222', 'Complete Blood Count', 'diagnostic', 1, 500.00, 500.00, NOW() - INTERVAL '14 days'),
  -- Invoice 3 items (Surgery)
  ('ili33331-1111-1111-1111-111111111111', 'inv33333-3333-3333-3333-333333333333', 'Knee Replacement Surgery', 'procedure', 1, 35000.00, 35000.00, NOW() - INTERVAL '3 days'),
  ('ili33332-1111-1111-1111-111111111111', 'inv33333-3333-3333-3333-333333333333', 'Private Room (7 days)', 'room', 7, 3000.00, 21000.00, NOW() - INTERVAL '3 days'),
  ('ili33333-1111-1111-1111-111111111111', 'inv33333-3333-3333-3333-333333333333', 'Medications', 'medication', 1, 5000.00, 5000.00, NOW() - INTERVAL '3 days'),
  -- Invoice 4 items
  ('ili44441-1111-1111-1111-111111111111', 'inv44444-4444-4444-4444-444444444444', 'Dermatology Consultation', 'consultation', 1, 900.00, 900.00, NOW() - INTERVAL '3 days'),
  ('ili44442-1111-1111-1111-111111111111', 'inv44444-4444-4444-4444-444444444444', 'Medications', 'medication', 1, 600.00, 600.00, NOW() - INTERVAL '3 days'),
  -- Invoice 5 items (ICU)
  ('ili55551-1111-1111-1111-111111111111', 'inv55555-5555-5555-5555-555555555555', 'ICU Charges (5 days)', 'room', 5, 5000.00, 25000.00, NOW() - INTERVAL '4 days'),
  ('ili55552-1111-1111-1111-111111111111', 'inv55555-5555-5555-5555-555555555555', 'Medications and Procedures', 'medication', 1, 3000.00, 3000.00, NOW() - INTERVAL '4 days');

-- Payments
INSERT INTO payments (id, invoice_id, payment_date, amount, payment_method, transaction_id, notes, created_by, created_at)
VALUES
  ('pay11111-1111-1111-1111-111111111111', 'inv11111-1111-1111-1111-111111111111', CURRENT_DATE - 29, 3776.00, 'card', 'TXN-CARD-001', 'Full payment via credit card', 'admin', NOW() - INTERVAL '29 days'),
  ('pay22222-2222-2222-2222-222222222222', 'inv22222-2222-2222-2222-222222222222', CURRENT_DATE - 14, 1620.00, 'cash', NULL, 'Cash payment', 'admin', NOW() - INTERVAL '14 days'),
  ('pay33333-3333-3333-3333-333333333333', 'inv33333-3333-3333-3333-333333333333', CURRENT_DATE - 3, 20000.00, 'upi', 'UPI-98765432', 'Partial payment via UPI', 'admin', NOW() - INTERVAL '3 days'),
  ('pay44444-4444-4444-4444-444444444444', 'inv44444-4444-4444-4444-444444444444', CURRENT_DATE - 3, 1770.00, 'card', 'TXN-CARD-002', 'Debit card payment', 'admin', NOW() - INTERVAL '3 days');

-- Insurance Claims
INSERT INTO insurance_claims (id, hospital_id, insurance_policy_id, patient_id, invoice_id, claim_number, claim_date, claim_amount, approved_amount, status, notes, created_at)
VALUES
  ('clm11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ins33333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 'inv33333-3333-3333-3333-333333333333', 'CLM-2024-001', CURRENT_DATE - 2, 48100.00, 40000.00, 'approved', 'Approved for surgery and hospitalization', NOW() - INTERVAL '2 days');

-- ============================================================================
-- SECTION 10: STAFF SHIFTS
-- ============================================================================

INSERT INTO staff_shifts (id, hospital_id, user_id, shift_date, shift_type, start_time, end_time, status, notes, created_at)
VALUES
  -- Past shifts (completed)
  ('shft1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE - 7, 'morning', '08:00:00', '16:00:00', 'completed', 'Regular shift', NOW() - INTERVAL '7 days'),
  ('shft2222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE - 6, 'morning', '08:00:00', '16:00:00', 'completed', 'Regular shift', NOW() - INTERVAL '6 days'),
  ('shft3333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE - 5, 'morning', '08:00:00', '16:00:00', 'completed', 'Regular shift', NOW() - INTERVAL '5 days'),
  ('shft4444-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE - 4, 'afternoon', '12:00:00', '20:00:00', 'completed', 'Regular shift', NOW() - INTERVAL '4 days'),
  ('shft5555-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE - 3, 'morning', '08:00:00', '16:00:00', 'completed', 'Regular shift', NOW() - INTERVAL '3 days'),
  -- Today's shift (in progress)
  ('shft6666-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE, 'morning', '08:00:00', '16:00:00', 'scheduled', 'Today shift', NOW()),
  -- Future shifts (scheduled)
  ('shft7777-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE + 1, 'morning', '08:00:00', '16:00:00', 'scheduled', 'Tomorrow shift', NOW()),
  ('shft8888-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE + 2, 'afternoon', '12:00:00', '20:00:00', 'scheduled', 'Future shift', NOW()),
  ('shft9999-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin', CURRENT_DATE + 3, 'night', '20:00:00', '08:00:00', 'scheduled', 'Night shift', NOW());

-- ============================================================================
-- COMPLETION NOTE
-- ============================================================================
-- This seed file provides comprehensive demo data covering:
-- 1. Hospitals (3 real Indian hospital chains)
-- 2. Doctors (5 specialists across different departments)
-- 3. Departments (5 major departments)
-- 4. Patients (10 realistic Indian patients with diverse demographics)
-- 5. Patient Registrations (linking patients to hospital)
-- 6. Appointments (9 appointments in various statuses)
-- 7. Encounters (4 completed clinical encounters)
-- 8. Prescriptions (3 prescriptions with multiple medications)
-- 9. Lab Orders (6 orders with varying statuses)
-- 10. Lab Results (detailed results for completed tests)
-- 11. IPD Beds (8 beds across different ward types)
-- 12. Admissions (3 admissions including active and discharged)
-- 13. Pharmacy Inventory (10 common medications and supplies)
-- 14. Stock Transactions (opening stock and dispensing records)
-- 15. Insurance Policies (3 major Indian insurers)
-- 16. Invoices (5 invoices with line items)
-- 17. Payments (4 completed payments)
-- 18. Insurance Claims (1 approved claim)
-- 19. Staff Shifts (9 shifts covering past, present, and future)

-- All data uses realistic Indian names, locations, and medical patterns
-- sourced from publicly available information and rephrased for compliance.
