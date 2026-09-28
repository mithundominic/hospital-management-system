// Responsibility: TypeScript interfaces for operations, lab, pharmacy, and shifts

export interface LabOrder {
  id: string;
  encounter_id: string;
  hospital_id: string;
  test_name: string;
  test_code?: string;
  priority: "routine" | "urgent" | "stat";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  ordered_date: string;
  sample_collected_at?: string;
  result_available_at?: string;
  notes?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  hospital_id: string;
  item_name: string;
  item_code?: string;
  category: string;
  unit_price: number;
  unit_of_measure: string;
  reorder_level: number;
  quantity_in_stock?: number;
  created_at: string;
}

export interface Shift {
  id: string;
  hospital_id: string;
  user_id: string;
  shift_date: string;
  shift_type: "morning" | "afternoon" | "night";
  start_time: string;
  end_time: string;
  notes?: string;
  created_at: string;
}

export interface BedOccupancy {
  hospital_id: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_rate: number;
}

export interface LowStockItem {
  id: string;
  item_name: string;
  quantity_in_stock: number;
  reorder_level: number;
  category?: string;
}
