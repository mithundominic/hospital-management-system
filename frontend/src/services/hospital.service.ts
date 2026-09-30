// Responsibility: HTTP API calls and transport for hospitals

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type {
  Hospital,
  CreateHospitalInput,
  OnboardHospitalInput,
  OnboardHospitalResponse,
} from "@/types/hospital";

export const getHospitals = async (): Promise<Hospital[]> => {
  const data = await api.get<Hospital[]>(API_ROUTES.hospitals.list);
  return data || [];
};

export const getHospitalById = async (
  hospitalId: string,
): Promise<Hospital> => {
  return api.get<Hospital>(API_ROUTES.hospitals.detail(hospitalId));
};

export const updateHospital = async (
  hospitalId: string,
  updates: Partial<Hospital>,
): Promise<Hospital> => {
  return api.patch<Hospital>(API_ROUTES.hospitals.detail(hospitalId), updates);
};

export const createHospital = async (
  payload: CreateHospitalInput,
): Promise<Hospital> => {
  return api.post<Hospital>(API_ROUTES.hospitals.list, payload);
};

export const onboardHospital = async (
  payload: OnboardHospitalInput,
): Promise<OnboardHospitalResponse> => {
  return api.postPublic<OnboardHospitalResponse>("/onboarding", payload);
};
