// Responsibility: Manage state and submission for appointment booking

import { useState, useCallback, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import {
  createHospitalAppointment,
  updateHospitalAppointment,
} from "@/services/appointment.service";
import { APPOINTMENT_STATUS } from "@/constants";
import type { Appointment } from "@/types";
import type { AppointmentFormData } from "./appointment.types";
import { useAppointmentOptions } from "./useAppointmentOptions";

export const useAppointmentForm = (
  onClose: () => void,
  onSuccess: () => void,
  appointment?: Appointment | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: appointment?.patient_id || "",
    doctor_membership_id: "",
    department_id: "",
    scheduled_at: appointment?.scheduled_at
      ? new Date(appointment.scheduled_at).toISOString().slice(0, 16)
      : "",
    duration_minutes: appointment?.duration_minutes || 30,
    reason: appointment?.reason || "",
    status: appointment?.status || APPOINTMENT_STATUS.SCHEDULED,
  });

  const { patients, doctors } = useAppointmentOptions(currentHospital?.id);

  const updateField = useCallback(
    <K extends keyof AppointmentFormData>(
      key: K,
      val: AppointmentFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        const payload = {
          ...formData,
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
          duration_minutes: Number(formData.duration_minutes),
        };
        if (appointment?.id) {
          await updateHospitalAppointment(
            currentHospital.id,
            appointment.id,
            payload,
          );
          toast.success("Appointment updated successfully");
        } else {
          await createHospitalAppointment(currentHospital.id, payload);
          toast.success("Appointment booked successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save appointment";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, appointment, onSuccess, onClose],
  );

  return {
    loading,
    formData,
    updateField,
    patients,
    doctors,
    handleSubmit,
  } as const;
};
