// Responsibility: TypeScript interfaces for appointment forms and scheduling workflows

import type { Appointment } from "@/types";

export interface PatientOption {
  id: string;
  full_name: string;
  phone?: string;
}

export interface DoctorOption {
  id: string;
  user_id?: string;
  membership_id?: string;
  specialization?: string;
  user?: { email: string };
}

export interface AppointmentFormData {
  patient_id: string;
  doctor_membership_id: string;
  department_id: string;
  scheduled_at: string;
  duration_minutes: number;
  reason: string;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
}

export interface AppointmentFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  appointment?: Appointment | null;
}
