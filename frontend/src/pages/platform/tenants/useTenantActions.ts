// Responsibility: Tenant lifecycle action mutations

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";
import toast from "react-hot-toast";

export const useTenantActions = () => {
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: ({
      hospitalId,
      reason,
    }: {
      hospitalId: string;
      reason: string;
    }) => tenantService.suspendTenant(hospitalId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant suspended successfully");
    },
    onError: () => toast.error("Failed to suspend tenant"),
  });

  const reactivateMutation = useMutation({
    mutationFn: tenantService.reactivateTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant reactivated successfully");
    },
    onError: () => toast.error("Failed to reactivate tenant"),
  });

  const archiveMutation = useMutation({
    mutationFn: tenantService.archiveTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant archived successfully");
    },
    onError: () => toast.error("Failed to archive tenant"),
  });

  return {
    suspendTenant: suspendMutation.mutate,
    reactivateTenant: reactivateMutation.mutate,
    archiveTenant: archiveMutation.mutate,
    isLoading:
      suspendMutation.isPending ||
      reactivateMutation.isPending ||
      archiveMutation.isPending,
  } as const;
};
