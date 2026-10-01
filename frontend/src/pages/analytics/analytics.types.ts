// Responsibility: TypeScript interfaces for analytics dashboard data structures

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePreset {
  id: string;
  label: string;
  getValue: () => DateRange;
}

export interface AnalyticsOverview {
  total_revenue: number;
  total_patients: number;
  total_appointments: number;
  active_prescriptions: number;
  pending_payments: number;
  bed_occupancy_rate: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  invoice_count: number;
}

export interface PaymentByMethod {
  method: string;
  amount: number;
  count: number;
}

export interface FinancialAnalytics {
  total_revenue: number;
  total_collected: number;
  total_outstanding: number;
  revenue_by_day: RevenueByDay[];
  payment_by_method: PaymentByMethod[];
}

export interface PatientFlowData {
  date: string;
  new_patients: number;
}

export interface AppointmentsByStatus {
  status: string;
  count: number;
}

export interface BedUtilization {
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_rate: number;
}

export interface OperationalAnalytics {
  patient_flow: PatientFlowData[];
  appointments_by_status: AppointmentsByStatus[];
  bed_utilization: BedUtilization;
}

export interface DoctorPerformance {
  doctor_id: string;
  doctor_name: string;
  department: string;
  patient_count: number;
  encounter_count: number;
  revenue: number;
}

export interface EncounterType {
  type: string;
  count: number;
}

export interface ClinicalAnalytics {
  doctor_performance: DoctorPerformance[];
  encounter_types: EncounterType[];
}

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

export type AnalyticsCategory =
  | "overview"
  | "financial"
  | "operational"
  | "clinical"
  | "inventory";
