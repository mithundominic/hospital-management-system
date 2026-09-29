// Responsibility: Reports table column and UI tab configurations

import type { TableColumn } from "@/types/table.types";
import type { LowStockItem } from "@/types";
import type { TabItem } from "@/components/ui/Tabs";

export type ReportsTabId = "charts" | "low_stock";

export const REPORTS_LOW_STOCK_COLUMNS: TableColumn<LowStockItem>[] = [
  { key: "item_name", header: "Item Name" },
  { key: "quantity_in_stock", header: "Current Stock" },
  { key: "reorder_level", header: "Reorder Level" },
  { key: "category", header: "Category" },
];

export const buildReportsTabs = (
  lowStockCount: number,
): readonly TabItem<ReportsTabId>[] =>
  [
    { id: "charts", label: "Analytics & Trends" },
    { id: "low_stock", label: "Low Stock Inventory", count: lowStockCount },
  ] as const;
