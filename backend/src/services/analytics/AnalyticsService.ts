// Responsibility: Main analytics orchestrator aggregating all analytics domains

import { SupabaseClient } from "@supabase/supabase-js";
import { getFinancialAnalytics } from "./FinancialAnalyticsService";
import { getOperationalAnalytics } from "./OperationalAnalyticsService";
import { getClinicalAnalytics } from "./ClinicalAnalyticsService";
import { getInventoryAnalytics } from "./InventoryAnalyticsService";

export const getOverviewAnalytics = async (
  supabase: SupabaseClient,
  hospitalId: string,
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase.rpc("get_analytics_overview", {
    p_hospital_id: hospitalId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) throw error;
  return data;
};

export const getAnalyticsByCategory = async (
  supabase: SupabaseClient,
  hospitalId: string,
  category: string,
  startDate: string,
  endDate: string
) => {
  switch (category) {
    case "financial":
      return getFinancialAnalytics(supabase, hospitalId, startDate, endDate);
    case "operational":
      return getOperationalAnalytics(supabase, hospitalId, startDate, endDate);
    case "clinical":
      return getClinicalAnalytics(supabase, hospitalId, startDate, endDate);
    case "inventory":
      return getInventoryAnalytics(supabase, hospitalId, startDate, endDate);
    default:
      throw new Error(`Invalid category: ${category}`);
  }
};
