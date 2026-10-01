// Responsibility: HTTP API calls for platform admin operations

import { api } from "@/lib/api";
import type {
  PlatformHospital,
  HospitalStats,
  PlatformAnalytics,
} from "@/types/platform";

export interface PlatformStatus {
  isPlatformAdmin: boolean;
}

export const getPlatformStatus = async (): Promise<PlatformStatus> => {
  return api.get<PlatformStatus>("/platform/status");
};

export const getPlatformHospitals = async (): Promise<PlatformHospital[]> => {
  return api.get<PlatformHospital[]>("/platform/hospitals");
};

export const getPlatformAnalytics = async (): Promise<PlatformAnalytics> => {
  return api.get<PlatformAnalytics>("/platform/analytics");
};

export const getHospitalStats = async (
  hospitalId: string,
): Promise<HospitalStats> => {
  return api.get<HospitalStats>(`/platform/hospitals/${hospitalId}/stats`);
};

export const activateHospital = async (
  hospitalId: string,
): Promise<PlatformHospital> => {
  return api.patch<PlatformHospital>(
    `/platform/hospitals/${hospitalId}/activate`,
    {},
  );
};

export const deactivateHospital = async (
  hospitalId: string,
): Promise<PlatformHospital> => {
  return api.patch<PlatformHospital>(
    `/platform/hospitals/${hospitalId}/deactivate`,
    {},
  );
};
