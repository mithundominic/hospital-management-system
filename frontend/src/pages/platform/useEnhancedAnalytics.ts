// Responsibility: Fetch enhanced analytics data

import { useQuery } from "@tanstack/react-query";
import { platformAnalyticsService } from "@/services/platformAnalytics.service";

export const useEnhancedAnalytics = () => {
  const revenueQuery = useQuery({
    queryKey: ["platform-analytics", "revenue-timeseries"],
    queryFn: () => platformAnalyticsService.getRevenueTimeSeries(),
  });

  const hospitalQuery = useQuery({
    queryKey: ["platform-analytics", "hospital-comparison"],
    queryFn: () => platformAnalyticsService.getHospitalComparison(),
  });

  const staffQuery = useQuery({
    queryKey: ["platform-analytics", "staff-distribution"],
    queryFn: () => platformAnalyticsService.getStaffDistribution(),
  });

  return {
    revenueData: revenueQuery.data ?? [],
    isLoadingRevenue: revenueQuery.isLoading,
    hospitalData: hospitalQuery.data ?? [],
    isLoadingHospital: hospitalQuery.isLoading,
    staffData: staffQuery.data ?? [],
    isLoadingStaff: staffQuery.isLoading,
  } as const;
};
