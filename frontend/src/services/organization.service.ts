// Responsibility: HTTP REST client methods for enterprise organization operations

import { api } from "@/lib/api";
import type {
  Organization,
  UserOrganization,
  CreateFacilityInput,
  EmpiPatientResult,
} from "@/types/organization";
import type { Hospital } from "@/types/hospital";

export const organizationService = {
  getUserOrganizations: async (): Promise<UserOrganization[]> => {
    return api.get<UserOrganization[]>("/organizations");
  },

  getOrganization: async (orgId: string): Promise<Organization> => {
    return api.get<Organization>(`/organizations/${orgId}`);
  },

  updateOrganization: async (
    orgId: string,
    data: Partial<Organization>,
  ): Promise<Organization> => {
    return api.patch<Organization>(`/organizations/${orgId}`, data);
  },

  getFacilities: async (orgId: string): Promise<Hospital[]> => {
    return api.get<Hospital[]>(`/organizations/${orgId}/facilities`);
  },

  createFacility: async (
    orgId: string,
    data: CreateFacilityInput,
  ): Promise<Hospital> => {
    return api.post<Hospital>(`/organizations/${orgId}/facilities`, data);
  },

  searchPatients: async (
    orgId: string,
    query: string,
  ): Promise<EmpiPatientResult[]> => {
    const encoded = encodeURIComponent(query);
    return api.get<EmpiPatientResult[]>(
      `/organizations/${orgId}/patients/search?q=${encoded}`,
    );
  },

  getMembers: async (orgId: string): Promise<unknown[]> => {
    return api.get<unknown[]>(`/organizations/${orgId}/members`);
  },
};
