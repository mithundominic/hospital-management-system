// Responsibility: TypeScript types and interfaces for prescription forms

export interface PrescriptionItem {
  id?: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration_days: string;
  route: string;
  instructions: string;
}

export interface PrescriptionEncounterOption {
  id: string;
  chief_complaint?: string;
  created_at?: string;
}

export interface PrescriptionFormModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  encounterId?: string;
  patientId?: string;
}

export const createDefaultPrescriptionItem = (): PrescriptionItem => ({
  medicine_name: "",
  dosage: "",
  frequency: "",
  duration_days: "",
  route: "oral",
  instructions: "",
});
