// Responsibility: Fetch platform-wide analytics data

import { useQuery } from "@tanstack/react-query";
import { getPlatformAnalytics } from "@/services/platform.service";

export const usePlatformAnalytics = () => {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["platform", "analytics"],
    queryFn: getPlatformAnalytics,
    staleTime: 1000 * 60 * 5,
  });

  return {
    analytics,
    isLoading,
    error,
  };
};
