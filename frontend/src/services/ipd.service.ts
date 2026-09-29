// Responsibility: HTTP API calls and transport for IPD beds and admissions

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { Bed, Admission } from "@/types";
import type { AdmissionFormData } from "@/pages/ipd/ipd.types";

export const getHospitalBeds = async (hospitalId: string): Promise<Bed[]> => {
  const data = await api.get<Bed[]>(API_ROUTES.hospitals.beds(hospitalId));
  return data || [];
};

export const createHospitalAdmission = async (
  hospitalId: string,
  payload: Partial<AdmissionFormData>,
): Promise<Admission> => {
  return api.post<Admission>(
    API_ROUTES.hospitals.admissions(hospitalId),
    payload,
  );
};

export const updateHospitalAdmission = async (
  hospitalId: string,
  admissionId: string,
  payload: Partial<AdmissionFormData>,
): Promise<Admission> => {
  return api.patch<Admission>(
    API_ROUTES.hospitals.admission(hospitalId, admissionId),
    payload,
  );
};
