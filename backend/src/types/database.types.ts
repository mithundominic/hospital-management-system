// backend/src/types/database.types.ts
// Responsibility: Database table types matching the schema from migrations

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
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
    | "pending"
    | "sample_collected"
    | "in_progress"
    | "completed"
    | "cancelled";
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

export interface Bed {
  id: string;
  hospital_id: string;
  department_id: string;
  bed_number: string;
  ward: string;
  status: "available" | "occupied" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface Admission {
  id: string;
  hospital_id: string;
  encounter_id: string;
  patient_id: string;
  bed_id: string;
  admitting_doctor_membership_id: string;
  status: "active" | "discharged" | "transferred";
  admitted_at: string;
  discharged_at?: string;
  discharge_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  hospital_id: string;
  name: string;
  category: string;
  unit: string;
  reorder_level: number;
  created_at: string;
  updated_at: string;
}

export interface StockTransaction {
  id: string;
  hospital_id: string;
  inventory_item_id: string;
  transaction_type: "purchase" | "dispense" | "adjustment" | "return";
  quantity: number;
  prescription_item_id?: string;
  performed_by: string;
  notes?: string;
  transaction_at: string;
}

export interface Invoice {
  id: string;
  hospital_id: string;
  patient_id: string;
  encounter_id?: string;
  admission_id?: string;
  invoice_number: string;
  subtotal: number;
  cgst_total: number;
  sgst_total: number;
  total_amount: number;
  status: "draft" | "issued" | "paid" | "cancelled";
  issued_at?: string;
  due_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  cgst_amount?: number;
  sgst_amount?: number;
}

export interface Payment {
  id: string;
  hospital_id: string;
  invoice_id: string;
  amount: number;
  payment_method: "cash" | "card" | "upi" | "bank_transfer" | "insurance";
  reference_number?: string;
  received_by: string;
  notes?: string;
  paid_at: string;
}

export interface InsurancePolicy {
  id: string;
  patient_id: string;
  provider_name: string;
  tpa_name?: string;
  policy_number: string;
  valid_from: string;
  valid_to: string;
  coverage_details?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaim {
  id: string;
  hospital_id: string;
  invoice_id: string;
  insurance_policy_id: string;
  claim_type: "cashless" | "reimbursement";
  claimed_amount: number;
  approved_amount?: number;
  status: "submitted" | "pre_authorized" | "approved" | "rejected" | "settled";
  handled_by: string;
  submitted_at: string;
  resolved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffShift {
  id: string;
  hospital_id: string;
  membership_id: string;
  department_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AbdmLinkRequest {
  id: string;
  hospital_id: string;
  patient_id: string;
  link_type: string;
  abdm_request_id?: string;
  status: "initiated" | "otp_sent" | "confirmed" | "failed";
  initiated_at: string;
  resolved_at?: string;
}

export interface AbdmConsentArtifact {
  id: string;
  hospital_id: string;
  patient_id: string;
  consent_request_id?: string;
  artifact_id?: string;
  purpose: string;
  status: "requested" | "granted" | "denied" | "expired";
  requested_at: string;
  resolved_at?: string;
}

export interface AbdmCallbackLog {
  id: string;
  callback_type: string;
  abdm_request_id?: string;
  payload: Record<string, unknown>;
  received_at: string;
}
