// Responsibility: Core foundation, patient, hospital, and membership database types
// backend/src/types/core.types.ts

export interface Hospital {
  id: string;
  name: string;
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  tagline?: string;
  brand_color?: string;
  gst_number?: string;
  nabh_number?: string;
  prescription_footer?: string;
  invoice_notes?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHospitalDTO {
  name: string;
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Patient {
  id: string;
  full_name: string;
  dob: string;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  blood_group?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientRegistration {
  id: string;
  patient_id: string;
  hospital_id: string;
  hospital_patient_number: string;
  registered_at: string;
}

export interface Role {
  id: string;
  name: string;
  scope: "platform" | "hospital";
  created_at: string;
}

export interface Permission {
  id: string;
  key: string;
  description: string;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  hospital_id: string;
  role_id: string;
  status: "invited" | "active" | "suspended";
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  created_at: string;
}

export interface DoctorProfile {
  id: string;
  membership_id: string;
  department_id: string;
  specialization: string;
  registration_number: string;
  qualifications?: string;
  consultation_fee?: number;
  created_at: string;
  updated_at: string;
}
