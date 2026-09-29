// Responsibility: Centralized domain status enums and type definitions

export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const INVOICE_STATUS = {
  DRAFT: "draft",
  ISSUED: "issued",
  PAID: "paid",
  PARTIALLY_PAID: "partially_paid",
  VOID: "void",
  PENDING: "pending",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export type InvoiceStatus =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export const BED_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  MAINTENANCE: "maintenance",
  CLEANING: "cleaning",
} as const;

export type BedStatus = (typeof BED_STATUS)[keyof typeof BED_STATUS];

export const ADMISSION_STATUS = {
  ADMITTED: "admitted",
  DISCHARGED: "discharged",
  TRANSFERRED: "transferred",
} as const;

export type AdmissionStatus =
  (typeof ADMISSION_STATUS)[keyof typeof ADMISSION_STATUS];

export const LAB_ORDER_STATUS = {
  ORDERED: "ordered",
  SAMPLE_COLLECTED: "sample_collected",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type LabOrderStatus =
  (typeof LAB_ORDER_STATUS)[keyof typeof LAB_ORDER_STATUS];

export const CLAIM_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  SETTLED: "settled",
} as const;

export type ClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

export const SHIFT_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type ShiftStatus = (typeof SHIFT_STATUS)[keyof typeof SHIFT_STATUS];
