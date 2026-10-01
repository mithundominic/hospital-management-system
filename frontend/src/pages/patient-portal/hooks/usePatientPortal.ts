// Responsibility: React Query hooks for patient portal data fetching

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientPortalService } from "../../../services/patientPortal.service";
import type { AppointmentRequest } from "../patientPortal.types";

export const useMyRegistrations = () => {
  return useQuery({
    queryKey: ["myRegistrations"],
    queryFn: () => patientPortalService.getMyRegistrations(),
  });
};

export const useMyAppointments = (filters?: {
  status?: string;
  from_date?: string;
}) => {
  return useQuery({
    queryKey: ["myAppointments", filters],
    queryFn: () => patientPortalService.getMyAppointments(filters),
  });
};

export const useRequestAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentRequest) =>
      patientPortalService.requestAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
};

export const useMyLabResults = () => {
  return useQuery({
    queryKey: ["myLabResults"],
    queryFn: () => patientPortalService.getMyLabResults(),
  });
};

export const useMyPrescriptions = () => {
  return useQuery({
    queryKey: ["myPrescriptions"],
    queryFn: () => patientPortalService.getMyPrescriptions(),
  });
};
