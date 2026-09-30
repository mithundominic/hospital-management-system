// Responsibility: Hospital activation/deactivation actions with optimistic updates

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  activateHospital,
  deactivateHospital,
} from "@/services/platform.service";
import toast from "react-hot-toast";

export const useHospitalActions = () => {
  const queryClient = useQueryClient();

  const activate = useMutation({
    mutationFn: activateHospital,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform", "hospitals"] });
      toast.success("Hospital activated successfully");
    },
    onError: () => {
      toast.error("Failed to activate hospital");
    },
  });

  const deactivate = useMutation({
    mutationFn: deactivateHospital,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform", "hospitals"] });
      toast.success("Hospital deactivated successfully");
    },
    onError: () => {
      toast.error("Failed to deactivate hospital");
    },
  });

  return {
    activateHospital: activate.mutate,
    deactivateHospital: deactivate.mutate,
    isActivating: activate.isPending,
    isDeactivating: deactivate.isPending,
  };
};
