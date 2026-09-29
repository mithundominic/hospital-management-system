// Responsibility: Clinical domain status badge configurations

import type { StatusBadgeConfig } from "./types";
import type { AppointmentStatus } from "@/constants/statuses";

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  StatusBadgeConfig
> = {
  scheduled: { label: "Scheduled", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  no_show: { label: "No Show", variant: "default" },
};

export const encounterStatusConfig: Record<string, StatusBadgeConfig> = {
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  draft: { label: "Draft", variant: "default" },
};

export const patientStatusConfig: Record<string, StatusBadgeConfig> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "default" },
  archived: { label: "Archived", variant: "danger" },
};

export const encounterTypeConfig: Record<string, StatusBadgeConfig> = {
  opd: { label: "OPD", variant: "info" },
  emergency: { label: "EMERGENCY", variant: "danger" },
  ipd: { label: "IPD", variant: "purple" },
};
