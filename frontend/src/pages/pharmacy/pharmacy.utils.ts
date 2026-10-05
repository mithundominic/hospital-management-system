// Responsibility: Pure calculation utilities for pharmacy inventory metrics and stock alerts

import type { InventoryItem } from "@/types";

export function filterLowStockItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter(
    (item) => (item.current_stock ?? item.quantity_in_stock ?? 0) <= item.reorder_level,
  );
}

export function computeTotalInventoryValue(items: InventoryItem[]): number {
  return items.reduce(
    (acc, curr) => {
      const stock = curr.current_stock ?? curr.quantity_in_stock ?? 0;
      const price = curr.unit_price ?? 0;
      return acc + stock * price;
    },
    0,
  );
}
