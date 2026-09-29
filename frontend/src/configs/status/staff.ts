// Responsibility: Staff role and status badge configurations

import type { StatusBadgeConfig } from "./types";

export const staffRoleBadgeConfig: Record<string, StatusBadgeConfig> = {
  Doctor: { label: "Doctor", variant: "info" },
  Nurse: { label: "Nurse", variant: "purple" },
  HospitalAdmin: { label: "Admin", variant: "danger" },
  Receptionist: { label: "Receptionist", variant: "warning" },
  BillingClerk: { label: "Billing", variant: "success" },
  Pharmacist: { label: "Pharmacist", variant: "info" },
  LabTech: { label: "Lab Tech", variant: "purple" },
};

export const staffStatusConfig: Record<string, StatusBadgeConfig> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "default" },
  suspended: { label: "Suspended", variant: "danger" },
};
