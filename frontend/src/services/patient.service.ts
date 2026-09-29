// Responsibility: HTTP API calls and data transport for patient operations

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { Patient } from "@/types";

export interface PatientRecordItem {
  patients: Patient;
  hospital_patient_number: string;
}

export interface PatientInputData {
  full_name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  blood_group: string;
  hospital_patient_number: string;
}

export const getHospitalPatients = async (
  hospitalId: string,
): Promise<PatientRecordItem[]> => {
  const data = await api.get<PatientRecordItem[]>(
    API_ROUTES.hospitals.patients(hospitalId),
  );
  return data || [];
};

export const getHospitalPatientById = async (
  hospitalId: string,
  patientId: string,
): Promise<Patient | null> => {
  return api.get<Patient>(API_ROUTES.hospitals.patient(hospitalId, patientId));
};

export const createHospitalPatient = async (
  hospitalId: string,
  data: PatientInputData,
): Promise<Patient> => {
  return api.post<Patient>(API_ROUTES.hospitals.patients(hospitalId), data);
};

export const updateHospitalPatient = async (
  hospitalId: string,
  patientId: string,
  data: Partial<PatientInputData>,
): Promise<Patient> => {
  return api.patch<Patient>(
    API_ROUTES.hospitals.patient(hospitalId, patientId),
    data,
  );
};
