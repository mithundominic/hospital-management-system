// Responsibility: Configuration-driven status badge definitions and mappings

import type { BadgeVariant } from "@/components/ui/Badge";
import type {
  AppointmentStatus,
  InvoiceStatus,
  BedStatus,
  AdmissionStatus,
  LabOrderStatus,
  ClaimStatus,
  ShiftStatus,
} from "@/constants/statuses";

export interface StatusBadgeConfig {
  label: string;
  variant: BadgeVariant;
}

export const appointmentStatusConfig: Record<AppointmentStatus, StatusBadgeConfig> = {
  scheduled: { label: "Scheduled", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  no_show: { label: "No Show", variant: "default" },
};

export const invoiceStatusConfig: Record<InvoiceStatus, StatusBadgeConfig> = {
  draft: { label: "Draft", variant: "default" },
  issued: { label: "Issued", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  partially_paid: { label: "Partially Paid", variant: "purple" },
  void: { label: "Void", variant: "danger" },
};

export const bedStatusConfig: Record<BedStatus, StatusBadgeConfig> = {
  available: { label: "Available", variant: "success" },
  occupied: { label: "Occupied", variant: "danger" },
  maintenance: { label: "Maintenance", variant: "warning" },
  cleaning: { label: "Cleaning", variant: "info" },
};

export const admissionStatusConfig: Record<AdmissionStatus, StatusBadgeConfig> = {
  admitted: { label: "Admitted", variant: "danger" },
  discharged: { label: "Discharged", variant: "success" },
  transferred: { label: "Transferred", variant: "warning" },
};

export const labOrderStatusConfig: Record<LabOrderStatus, StatusBadgeConfig> = {
  ordered: { label: "Ordered", variant: "warning" },
  sample_collected: { label: "Sample Collected", variant: "info" },
  processing: { label: "Processing", variant: "purple" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

export const claimStatusConfig: Record<ClaimStatus, StatusBadgeConfig> = {
  draft: { label: "Draft", variant: "default" },
  submitted: { label: "Submitted", variant: "info" },
  in_review: { label: "In Review", variant: "warning" },
  approved: { label: "Approved", variant: "purple" },
  rejected: { label: "Rejected", variant: "danger" },
  settled: { label: "Settled", variant: "success" },
};

export const shiftStatusConfig: Record<ShiftStatus, StatusBadgeConfig> = {
  scheduled: { label: "Scheduled", variant: "info" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};
