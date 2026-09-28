// Responsibility: Operational database types for beds, admissions, inventory, and shifts
// backend/src/types/operations.types.ts

export interface Bed {
  id: string;
  hospital_id: string;
  department_id: string;
  bed_number: string;
  ward: string;
  status: "available" | "occupied" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface Admission {
  id: string;
  hospital_id: string;
  encounter_id: string;
  patient_id: string;
  bed_id: string;
  admitting_doctor_membership_id: string;
  status: "active" | "discharged" | "transferred";
  admitted_at: string;
  discharged_at?: string;
  discharge_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  hospital_id: string;
  name: string;
  category: string;
  unit: string;
  reorder_level: number;
  created_at: string;
  updated_at: string;
}

export interface StockTransaction {
  id: string;
  hospital_id: string;
  inventory_item_id: string;
  transaction_type: "purchase" | "dispense" | "adjustment" | "return";
  quantity: number;
  prescription_item_id?: string;
  performed_by: string;
  notes?: string;
  transaction_at: string;
}

export interface StaffShift {
  id: string;
  hospital_id: string;
  membership_id: string;
  department_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
