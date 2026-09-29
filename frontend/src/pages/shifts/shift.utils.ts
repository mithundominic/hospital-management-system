// Responsibility: Pure utility functions for shift time presets and payload transformation

import type { ShiftFormData } from "./shift.types";
import type { CreateShiftPayload } from "@/services/shift.service";

export const getShiftPresetTimes = (
  date: string,
  type: "morning" | "afternoon" | "night",
) => {
  const d = date || new Date().toISOString().slice(0, 10);
  switch (type) {
    case "morning":
      return { start: `${d}T06:00`, end: `${d}T14:00` };
    case "afternoon":
      return { start: `${d}T14:00`, end: `${d}T22:00` };
    case "night":
      return { start: `${d}T22:00`, end: `${d}T06:00` };
  }
};

export const toShiftPayload = (formData: ShiftFormData): CreateShiftPayload => ({
  user_id: formData.staff_id,
  shift_date: formData.shift_date,
  shift_type: formData.shift_type,
  start_time: formData.shift_start.slice(11, 16),
  end_time: formData.shift_end.slice(11, 16),
});
