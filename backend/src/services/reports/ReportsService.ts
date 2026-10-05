// Responsibility: Business logic and data queries for hospital operational reports

import { SupabaseClient } from "@supabase/supabase-js";

export interface RevenueDateRange {
  from?: string;
  to?: string;
}

export const queryBedOccupancySummary = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("bed_occupancy_summary")
    .select("hospital_id, department_id, total_beds, occupied_beds, available_beds, maintenance_beds, occupancy_pct")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};

export const queryDailyRevenueSummary = async (
  supabase: SupabaseClient,
  hospitalId: string,
  range: RevenueDateRange = {},
) => {
  let query = supabase
    .from("daily_revenue_summary")
    .select("hospital_id, revenue_date, total_collected, invoices_touched")
    .eq("hospital_id", hospitalId);

  if (range.from) query = query.gte("revenue_date", range.from);
  if (range.to) query = query.lte("revenue_date", range.to);

  const { data, error } = await query.order("revenue_date", {
    ascending: false,
  });
  if (error) throw error;
  return data;
};

export const queryLowStockAlerts = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("low_stock_alert")
    .select("hospital_id, inventory_item_id, name, unit, current_stock, reorder_level")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};
