// Responsibility: Fetch and manage platform hospitals list with stats

import { useQuery } from "@tanstack/react-query";
import { getPlatformHospitals } from "@/services/platform.service";

export const usePlatformHospitals = () => {
  const {
    data: hospitals = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["platform", "hospitals"],
    queryFn: getPlatformHospitals,
    staleTime: 1000 * 60 * 5,
  });

  return {
    hospitals,
    isLoading,
    error,
    refetch,
  };
};
