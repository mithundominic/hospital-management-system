// Responsibility: Billing table column and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { Invoice } from "@/types";

export const BILLING_TABLE_COLUMNS: TableColumn<Invoice>[] = [
  { key: "invoice_number", header: "Invoice #" },
  { key: "created_at", header: "Invoice Date" },
  { key: "total_amount", header: "Total Amount" },
  { key: "tax_amount", header: "Tax (GST)" },
  { key: "status", header: "Status" },
];
