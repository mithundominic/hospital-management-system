// Responsibility: Type definitions for FHIR builder inputs and intermediate data

import type { PatientBuilder } from "./PatientBuilder";
import type { EncounterBuilder } from "./EncounterBuilder";
import type { MedicationRequestBuilder } from "./MedicationRequestBuilder";

export interface LabOrderData {
  id: string;
  test_name: string;
  patient_id: string;
  encounter_id: string;
  ordered_at: string;
  status: string;
}

export interface LabResultData {
  id: string;
  parameter: string;
  value: string;
  unit?: string;
  reported_at: string;
}

export interface BundleData {
  patient: Parameters<typeof PatientBuilder.build>[0];
  encounter?: Parameters<typeof EncounterBuilder.build>[0];
  prescriptionItems?: Parameters<typeof MedicationRequestBuilder.build>[0];
  labOrder?: LabOrderData;
  labResults?: LabResultData[];
}
