// Responsibility: Fetch and manage tenant list with React Query

import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";

export const useTenants = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tenants"],
    queryFn: tenantService.getAllTenants,
  });

  return {
    tenants: data ?? [],
    isLoading,
    error,
    refetch,
  } as const;
};
