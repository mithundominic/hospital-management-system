// Responsibility: Pharmacy inventory table column and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { InventoryItem } from "@/types";

export const PHARMACY_TABLE_COLUMNS: TableColumn<InventoryItem>[] = [
  { key: "item_name", header: "Item Name" },
  { key: "category", header: "Category" },
  { key: "quantity_in_stock", header: "Current Stock" },
  { key: "reorder_level", header: "Reorder Level" },
  { key: "unit_price", header: "Unit Price" },
  { key: "status", header: "Status" },
];
