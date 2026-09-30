// Responsibility: Manage employee PIN mapping data fetching and mutations

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { biometricService } from "../../../services/biometric.service";
import type { CreatePinMappingInput } from "../../../types/biometric";

export const usePinMappings = (hospitalId: string) => {
  const queryClient = useQueryClient();

  const mappingsQuery = useQuery({
    queryKey: ["pin-mappings", hospitalId],
    queryFn: () => biometricService.getPinMappings(hospitalId),
    enabled: !!hospitalId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePinMappingInput) =>
      biometricService.createPinMapping(hospitalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-mappings", hospitalId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      mappingId,
      biometricPin,
    }: {
      mappingId: string;
      biometricPin: string;
    }) => biometricService.updatePinMapping(hospitalId, mappingId, biometricPin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-mappings", hospitalId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (mappingId: string) =>
      biometricService.deletePinMapping(hospitalId, mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-mappings", hospitalId] });
    },
  });

  return {
    mappings: mappingsQuery.data ?? [],
    isLoading: mappingsQuery.isLoading,
    error: mappingsQuery.error,
    createMapping: createMutation.mutateAsync,
    updateMapping: updateMutation.mutateAsync,
    deleteMapping: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  } as const;
};
