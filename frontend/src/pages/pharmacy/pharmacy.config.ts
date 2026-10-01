// Responsibility: Pharmacy inventory table column, tabs, and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { TabItem } from "@/components/ui/Tabs";
import type { InventoryItem } from "@/types";

export type PharmacyTabId = "all" | "low_stock";

export const PHARMACY_TABLE_COLUMNS: TableColumn<InventoryItem>[] = [
  { key: "item_name", header: "Item Name" },
  { key: "category", header: "Category" },
  { key: "quantity_in_stock", header: "Current Stock" },
  { key: "reorder_level", header: "Reorder Level" },
  { key: "unit_price", header: "Unit Price" },
  { key: "status", header: "Status" },
];

export const buildPharmacyTabs = (
  allCount: number,
  lowStockCount: number,
): readonly TabItem<PharmacyTabId>[] => [
  { id: "all", label: "All Medicines", count: allCount },
  { id: "low_stock", label: "Low Stock Alerts", count: lowStockCount },
] as const;
