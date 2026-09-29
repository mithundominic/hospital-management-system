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
    .select("*")
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
    .select("*")
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
    .select("*")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};
