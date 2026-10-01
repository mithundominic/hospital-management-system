// Responsibility: Cross-hospital analytics and platform-level metrics aggregation

import { SupabaseClient } from "@supabase/supabase-js";

export const getPlatformAnalytics = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.rpc("get_platform_analytics");
  if (!error && data) return data;

  const [hospitals, totalStaff, totalPatients, totalAppointments, payments] =
    await Promise.all([
      supabase.from("hospitals").select("id, is_active", { count: "exact" }),
      supabase
        .from("memberships")
        .select("id", { count: "exact" })
        .eq("status", "active"),
      supabase.from("patient_registrations").select("id", { count: "exact" }),
      supabase.from("appointments").select("id", { count: "exact" }),
      supabase.from("payments").select("amount"),
    ]);

  const activeHospitals =
    hospitals.data?.filter((h) => h.is_active).length || 0;
  const inactiveHospitals = (hospitals.count || 0) - activeHospitals;
  const totalRevenue =
    payments.data?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

  return {
    total_hospitals: hospitals.count || 0,
    active_hospitals: activeHospitals,
    inactive_hospitals: inactiveHospitals,
    total_staff: totalStaff.count || 0,
    total_patients: totalPatients.count || 0,
    total_appointments: totalAppointments.count || 0,
    total_revenue: totalRevenue,
  };
};
