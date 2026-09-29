// Responsibility: Manage appointments page state, filtering, queries, and cancellation logic

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import {
  getHospitalAppointments,
  updateHospitalAppointment,
} from "@/services/appointment.service";
import { QUERY_KEYS, APPOINTMENT_STATUS } from "@/constants";
import type { Appointment } from "@/types";

export const useAppointmentsPage = () => {
  const { currentHospital } = useHospital();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [showModal, setShowModal] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);

  const {
    data: appointments = [],
    isLoading,
    refetch,
  } = useQuery<Appointment[]>({
    queryKey: QUERY_KEYS.hospitals.appointments(
      currentHospital?.id,
      selectedDate,
    ),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalAppointments(currentHospital.id, selectedDate);
    },
    enabled: !!currentHospital,
  });

  const handleConfirmCancel = useCallback(async () => {
    if (!cancellingApt || !currentHospital) return;
    try {
      await updateHospitalAppointment(currentHospital.id, cancellingApt.id, {
        status: APPOINTMENT_STATUS.CANCELLED,
      });
      toast.success("Appointment cancelled successfully");
      refetch();
    } catch {
      toast.error("Failed to cancel appointment");
    } finally {
      setCancellingApt(null);
    }
  }, [cancellingApt, currentHospital, refetch]);

  return {
    selectedDate,
    setSelectedDate,
    showModal,
    setShowModal,
    editingApt,
    setEditingApt,
    cancellingApt,
    setCancellingApt,
    appointments,
    isLoading,
    refetch,
    handleConfirmCancel,
  } as const;
};
