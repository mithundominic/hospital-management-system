// Responsibility: TypeScript interfaces and configuration options for IPD admissions and wards

import type { Admission } from "@/types";

export interface AdmissionFormData {
  patient_id: string;
  bed_id: string;
  doctor_id: string;
  admission_type: string;
  admission_date: string;
  diagnosis: string;
  instructions: string;
}

export interface AdmissionFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  admission?: Admission | null;
}

export const admissionTypeOptions = [
  { value: "emergency", label: "Emergency" },
  { value: "planned", label: "Planned / Elective" },
  { value: "transfer", label: "Transfer" },
] as const;
