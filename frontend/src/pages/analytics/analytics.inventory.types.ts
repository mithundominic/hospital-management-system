// Responsibility: Type definitions for pharmacy and inventory analytics

export interface InventoryItem {
  name: string;
  item_code: string;
  quantity_dispensed: number;
  transaction_count?: number;
}

export interface LowStockItem {
  name: string;
  item_code: string;
  current_quantity: number;
  reorder_level: number;
}

export interface InventoryAnalytics {
  fast_moving_items: InventoryItem[];
  slow_moving_items: InventoryItem[];
  low_stock_alerts: LowStockItem[];
  total_stock_units: number;
}
