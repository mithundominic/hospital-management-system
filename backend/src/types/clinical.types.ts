// Responsibility: Clinical encounters, appointments, prescriptions, and lab orders types
// backend/src/types/clinical.types.ts

export interface Appointment {
  id: string;
  hospital_id: string;
  patient_id: string;
  doctor_membership_id: string;
  department_id: string;
  scheduled_at: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Encounter {
  id: string;
  hospital_id: string;
  patient_id: string;
  appointment_id?: string;
  doctor_membership_id: string;
  department_id: string;
  encounter_type: "opd" | "emergency" | "follow_up";
  chief_complaint?: string;
  vitals?: Record<string, unknown>;
  diagnosis?: string;
  status: "in_progress" | "completed";
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  hospital_id: string;
  encounter_id: string;
  prescribed_by: string;
  notes?: string;
  created_at: string;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  instructions?: string;
}

export interface LabOrder {
  id: string;
  hospital_id: string;
  encounter_id: string;
  ordered_by: string;
  test_name: string;
  status:
    "pending" | "sample_collected" | "in_progress" | "completed" | "cancelled";
  ordered_at: string;
  created_at: string;
  updated_at: string;
}

export interface LabResult {
  id: string;
  lab_order_id: string;
  result_value: string;
  unit?: string;
  reference_range?: string;
  is_abnormal: boolean;
  verified_by: string;
  verified_at: string;
  notes?: string;
  created_at: string;
}
