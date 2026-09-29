// Responsibility: HTTP API calls and transport for insurance claims

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { InsuranceClaim } from "@/types";

export const getHospitalInsuranceClaims = async (
  hospitalId: string,
): Promise<InsuranceClaim[]> => {
  const data = await api.get<InsuranceClaim[]>(
    API_ROUTES.hospitals.insuranceClaims(hospitalId),
  );
  return data || [];
};
