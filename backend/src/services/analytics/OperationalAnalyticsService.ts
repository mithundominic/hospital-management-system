// Responsibility: Operational analytics for patient flow and appointments

import { SupabaseClient } from "@supabase/supabase-js";

export const getOperationalAnalytics = async (
  supabase: SupabaseClient,
  hospitalId: string,
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase.rpc("get_operational_analytics", {
    p_hospital_id: hospitalId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) throw error;
  return data;
};
