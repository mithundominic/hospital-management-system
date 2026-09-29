// Responsibility: HTTP API calls and data transport for clinical encounters and prescriptions

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { Encounter } from "@/types";
import type { PrescriptionItem } from "@/components/common/prescription.types";

export interface CreateEncounterPayload {
  patient_id: string;
  doctor_id: string;
  encounter_type: string;
  chief_complaint?: string;
  diagnosis?: string;
  notes?: string;
  vitals?: Record<string, unknown> | null;
}

export interface CreatePrescriptionPayload {
  encounter_id: string;
  items: PrescriptionItem[];
}

export const getHospitalEncounters = async (
  hospitalId: string,
  patientId?: string,
): Promise<Encounter[]> => {
  const url = patientId
    ? `${API_ROUTES.hospitals.encounters(hospitalId)}?patient_id=${patientId}`
    : API_ROUTES.hospitals.encounters(hospitalId);
  const data = await api.get<Encounter[]>(url);
  return data || [];
};

export const createHospitalEncounter = async (
  hospitalId: string,
  payload: CreateEncounterPayload,
): Promise<Encounter> => {
  return api.post<Encounter>(
    API_ROUTES.hospitals.encounters(hospitalId),
    payload,
  );
};

export const updateHospitalEncounter = async (
  hospitalId: string,
  encounterId: string,
  payload: Partial<CreateEncounterPayload>,
): Promise<Encounter> => {
  return api.patch<Encounter>(
    `${API_ROUTES.hospitals.encounters(hospitalId)}/${encounterId}`,
    payload,
  );
};

export const createHospitalPrescription = async (
  hospitalId: string,
  payload: CreatePrescriptionPayload,
): Promise<{ success: boolean }> => {
  return api.post<{ success: boolean }>(
    API_ROUTES.hospitals.prescriptions(hospitalId),
    payload,
  );
};
