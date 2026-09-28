// Responsibility: TypeScript interfaces for clinical domain concepts

export interface PatientRegistration {
  id: string;
  patient_id: string;
  hospital_id: string;
  hospital_patient_number: string;
  registration_date: string;
}

export interface Patient {
  id: string;
  full_name: string;
  dob: string;
  gender: string;
  blood_group?: string;
  phone?: string;
  email?: string;
  address?: string;
  abha_address?: string;
  abha_verified?: boolean;
  created_at: string;
  patient_registrations?: PatientRegistration[];
}

export interface Doctor {
  id: string;
  user_id: string;
  hospital_id: string;
  department_id?: string;
  specialization: string;
  license_number: string;
  consultation_fee?: number;
  availability?: Record<string, unknown>;
  created_at: string;
}

export interface Vitals {
  bp_systolic?: number;
  bp_diastolic?: number;
  temperature?: number;
  pulse_rate?: number;
  respiratory_rate?: number;
  spo2?: number;
}

export interface Encounter {
  id: string;
  patient_id: string;
  hospital_id: string;
  doctor_id: string;
  encounter_type: 'opd' | 'emergency' | 'ipd';
  chief_complaint?: string;
  diagnosis?: string;
  notes?: string;
  vitals?: Vitals;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
  notes?: string;
  created_at: string;
}

export interface Bed {
  id: string;
  hospital_id: string;
  ward_name: string;
  bed_number: string;
  bed_type: string;
  status: 'available' | 'occupied' | 'maintenance';
  created_at: string;
}

export interface Admission {
  id: string;
  patient_id: string;
  hospital_id: string;
  bed_id: string;
  doctor_id: string;
  admission_date: string;
  discharge_date?: string;
  status: 'active' | 'discharged';
  admission_notes?: string;
  discharge_notes?: string;
  created_at: string;
}
