// Responsibility: HTTP API calls and transport for hospital analytics endpoints

import { api } from "@/lib/api";

export const getAnalyticsOverview = async <T>(
  hospitalId: string,
  startDate: string,
  endDate: string,
): Promise<T> => {
  return api.get<T>(
    `/hospitals/${hospitalId}/analytics/overview?startDate=${startDate}&endDate=${endDate}`,
  );
};

export const getAnalyticsByCategory = async <T>(
  hospitalId: string,
  category: string,
  startDate: string,
  endDate: string,
): Promise<T> => {
  return api.get<T>(
    `/hospitals/${hospitalId}/analytics/${category}?startDate=${startDate}&endDate=${endDate}`,
  );
};
