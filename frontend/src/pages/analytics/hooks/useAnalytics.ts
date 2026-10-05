// Responsibility: React hook for fetching analytics data by category and date range

import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsOverview,
  getAnalyticsByCategory,
} from "@/services/analytics.service";
import { AnalyticsCategory } from "../analytics.types";

export const useAnalytics = <T>(
  hospitalId: string | undefined,
  category: AnalyticsCategory,
  startDate: string,
  endDate: string,
) => {
  return useQuery({
    queryKey: ["analytics", hospitalId, category, startDate, endDate],
    queryFn: async () => {
      if (!hospitalId) throw new Error("Hospital ID is required");

      if (category === "overview") {
        return getAnalyticsOverview<T>(hospitalId, startDate, endDate);
      }

      return getAnalyticsByCategory<T>(
        hospitalId,
        category,
        startDate,
        endDate,
      );
    },
    enabled: !!hospitalId && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
};
