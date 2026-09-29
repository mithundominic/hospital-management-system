// Responsibility: Pure calculation utilities for billing aggregates and metrics

import { INVOICE_STATUS } from "@/constants";
import type { Invoice } from "@/types";

export interface BillingMetrics {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
}

export function computeBillingMetrics(invoices: Invoice[]): BillingMetrics {
  return {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === INVOICE_STATUS.PAID).length,
    pending: invoices.filter((i) => i.status === INVOICE_STATUS.PENDING).length,
    overdue: invoices.filter((i) => i.status === INVOICE_STATUS.OVERDUE).length,
  };
}
