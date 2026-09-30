// Responsibility: Manage biometric device data fetching and mutations

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { biometricService } from "../../../services/biometric.service";
import type {
  BiometricDevice,
  CreateDeviceInput,
} from "../../../types/biometric";

export const useBiometricDevices = (hospitalId: string) => {
  const queryClient = useQueryClient();

  const devicesQuery = useQuery({
    queryKey: ["biometric-devices", hospitalId],
    queryFn: () => biometricService.getDevices(hospitalId),
    enabled: !!hospitalId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDeviceInput) =>
      biometricService.createDevice(hospitalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["biometric-devices", hospitalId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      deviceId,
      data,
    }: {
      deviceId: string;
      data: Partial<CreateDeviceInput>;
    }) => biometricService.updateDevice(hospitalId, deviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["biometric-devices", hospitalId],
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      deviceId,
      status,
    }: {
      deviceId: string;
      status: BiometricDevice["status"];
    }) => biometricService.updateDeviceStatus(hospitalId, deviceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["biometric-devices", hospitalId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (deviceId: string) =>
      biometricService.deleteDevice(hospitalId, deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["biometric-devices", hospitalId],
      });
    },
  });

  return {
    devices: devicesQuery.data ?? [],
    isLoading: devicesQuery.isLoading,
    error: devicesQuery.error,
    createDevice: createMutation.mutateAsync,
    updateDevice: updateMutation.mutateAsync,
    updateDeviceStatus: updateStatusMutation.mutateAsync,
    deleteDevice: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  } as const;
};
