// Responsibility: TypeScript interfaces for clinical encounters and vitals data structures

import type { Encounter } from '@/types';

export interface EncounterVitalsData {
  temperature: string;
  blood_pressure_systolic: string;
  blood_pressure_diastolic: string;
  pulse_rate: string;
  respiratory_rate: string;
  oxygen_saturation: string;
  weight: string;
  height: string;
}

export interface EncounterFormData extends EncounterVitalsData {
  patient_id: string;
  doctor_id: string;
  encounter_type: 'opd' | 'emergency' | 'ipd';
  chief_complaint: string;
  diagnosis: string;
  notes: string;
  status: string;
}

export interface EncounterFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  encounter?: Encounter | null;
}
