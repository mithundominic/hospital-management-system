// Responsibility: Financial and billing status badge configurations

import type { StatusBadgeConfig } from "./types";
import type { InvoiceStatus, ClaimStatus } from "@/constants/statuses";

export const invoiceStatusConfig: Record<InvoiceStatus, StatusBadgeConfig> = {
  draft: { label: "Draft", variant: "default" },
  issued: { label: "Issued", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  partially_paid: { label: "Partially Paid", variant: "purple" },
  void: { label: "Void", variant: "danger" },
  pending: { label: "Pending", variant: "warning" },
  overdue: { label: "Overdue", variant: "danger" },
  cancelled: { label: "Cancelled", variant: "default" },
};

export const claimStatusConfig: Record<ClaimStatus, StatusBadgeConfig> = {
  draft: { label: "Draft", variant: "default" },
  submitted: { label: "Submitted", variant: "info" },
  in_review: { label: "In Review", variant: "warning" },
  approved: { label: "Approved", variant: "purple" },
  rejected: { label: "Rejected", variant: "danger" },
  settled: { label: "Settled", variant: "success" },
};

export const claimTypeConfig: Record<string, StatusBadgeConfig> = {
  cashless: { label: "Cashless", variant: "purple" },
  reimbursement: { label: "Reimbursement", variant: "info" },
};
