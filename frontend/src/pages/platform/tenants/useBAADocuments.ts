// Responsibility: Fetch BAA documents for a tenant

import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";

export const useBAADocuments = (hospitalId: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["baa-documents", hospitalId],
    queryFn: () => tenantService.getBAADocuments(hospitalId),
    enabled: !!hospitalId,
  });

  return {
    documents: data ?? [],
    isLoading,
    refetch,
  } as const;
};
