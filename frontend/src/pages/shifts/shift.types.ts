// Responsibility: TypeScript interfaces and configuration options for staff shift scheduling

import type { Shift } from "@/types";

export interface ShiftFormData {
  staff_id: string;
  shift_date: string;
  shift_start: string;
  shift_end: string;
  shift_type: "morning" | "afternoon" | "night";
}

export interface ShiftFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  shift?: Shift | null;
}

export const shiftTypeOptions = [
  { value: "morning", label: "Morning (06:00 - 14:00)" },
  { value: "afternoon", label: "Afternoon (14:00 - 22:00)" },
  { value: "night", label: "Night (22:00 - 06:00)" },
] as const;

export const shiftPresets = [
  { type: "morning" as const, label: "Morning (6am-2pm)" },
  { type: "afternoon" as const, label: "Afternoon (2pm-10pm)" },
  { type: "night" as const, label: "Night (10pm-6am)" },
] as const;
