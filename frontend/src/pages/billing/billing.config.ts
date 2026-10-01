// Responsibility: Billing table column, tabs, and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { TabItem } from "@/components/ui/Tabs";
import type { Invoice } from "@/types";

export type BillingTabId = "all" | "pending" | "paid";

export const BILLING_TABLE_COLUMNS: TableColumn<Invoice>[] = [
  { key: "invoice_number", header: "Invoice #" },
  { key: "created_at", header: "Invoice Date" },
  { key: "total_amount", header: "Total Amount" },
  { key: "tax_amount", header: "Tax (GST)" },
  { key: "status", header: "Status" },
  { key: "id", header: "Actions" },
];

export const buildBillingTabs = (
  allCount: number,
  pendingCount: number,
  paidCount: number,
): readonly TabItem<BillingTabId>[] => [
  { id: "all", label: "All Invoices", count: allCount },
  { id: "pending", label: "Pending & Issued", count: pendingCount },
  { id: "paid", label: "Paid", count: paidCount },
] as const;
