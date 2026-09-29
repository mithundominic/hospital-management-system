// Responsibility: Operational status badge configurations

import type { StatusBadgeConfig } from "./types";
import type {
  BedStatus,
  AdmissionStatus,
  LabOrderStatus,
  ShiftStatus,
} from "@/constants/statuses";

export const bedStatusConfig: Record<BedStatus, StatusBadgeConfig> = {
  available: { label: "Available", variant: "success" },
  occupied: { label: "Occupied", variant: "danger" },
  maintenance: { label: "Maintenance", variant: "warning" },
  cleaning: { label: "Cleaning", variant: "info" },
};

export const admissionStatusConfig: Record<AdmissionStatus, StatusBadgeConfig> =
  {
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

export const labOrderPriorityConfig: Record<string, StatusBadgeConfig> = {
  stat: { label: "STAT", variant: "danger" },
  urgent: { label: "URGENT", variant: "warning" },
  routine: { label: "ROUTINE", variant: "default" },
};

export const shiftStatusConfig: Record<ShiftStatus, StatusBadgeConfig> = {
  scheduled: { label: "Scheduled", variant: "info" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

export const inventoryStockStatusConfig: Record<string, StatusBadgeConfig> = {
  in_stock: { label: "In Stock", variant: "success" },
  low_stock: { label: "Low Stock", variant: "warning" },
  out_of_stock: { label: "Out of Stock", variant: "danger" },
};

export const alertBadgeConfig: Record<string, StatusBadgeConfig> = {
  warning: { label: "Warning", variant: "warning" },
  urgent: { label: "Urgent", variant: "danger" },
  info: { label: "Info", variant: "info" },
};
