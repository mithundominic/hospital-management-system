// Responsibility: Manage staff shift scheduling form state, timing presets, and API submission

import { useState, useCallback, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import {
  createHospitalShift,
  updateHospitalShift,
} from "@/services/shift.service";
import { getHospitalMemberships } from "@/services/staff.service";
import { QUERY_KEYS } from "@/constants";
import type { Shift } from "@/types";
import type { ShiftFormData } from "./shift.types";
import { getShiftPresetTimes, toShiftPayload } from "./shift.utils";

export const useShiftForm = (
  onClose: () => void,
  onSuccess: () => void,
  shift?: Shift | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShiftFormData>({
    staff_id: shift?.user_id || "",
    shift_date: shift?.shift_date || new Date().toISOString().slice(0, 10),
    shift_start: shift?.start_time
      ? `${shift.shift_date}T${shift.start_time}`
      : "",
    shift_end: shift?.end_time ? `${shift.shift_date}T${shift.end_time}` : "",
    shift_type: shift?.shift_type || "morning",
  });

  const { data: staffMembers = [] } = useQuery({
    queryKey: QUERY_KEYS.hospitals.memberships(currentHospital?.id),
    queryFn: () =>
      currentHospital ? getHospitalMemberships(currentHospital.id) : [],
    enabled: !!currentHospital,
  });

  const updateField = useCallback(
    <K extends keyof ShiftFormData>(key: K, val: ShiftFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  const setPreset = useCallback((type: "morning" | "afternoon" | "night") => {
    setFormData((prev) => {
      const times = getShiftPresetTimes(prev.shift_date, type);
      return {
        ...prev,
        shift_type: type,
        shift_start: times.start,
        shift_end: times.end,
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        const payload = toShiftPayload(formData);
        if (shift?.id) {
          await updateHospitalShift(currentHospital.id, shift.id, payload);
          toast.success("Shift updated successfully");
        } else {
          await createHospitalShift(currentHospital.id, payload);
          toast.success("Shift scheduled successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to save shift";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, shift, onSuccess, onClose],
  );

  return {
    loading,
    formData,
    updateField,
    staffMembers,
    setPreset,
    handleSubmit,
  } as const;
};
