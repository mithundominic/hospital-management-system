// Responsibility: Cross-hospital analytics and revenue time series aggregation

import { SupabaseClient } from "@supabase/supabase-js";

export * from "./PlatformMetricsService";

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

export const getRevenueTimeSeries = async (
  supabase: SupabaseClient,
  startDate?: string,
  endDate?: string,
  groupBy: "day" | "week" | "month" = "day",
) => {
  const start =
    startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = endDate || new Date().toISOString();

  const { data, error } = await supabase
    .from("payments")
    .select("amount, created_at")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at");

  if (error) throw error;

  const grouped: Record<string, number> = {};
  data?.forEach((payment) => {
    const date = new Date(payment.created_at);
    let key: string;
    if (groupBy === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0] || "";
    } else {
      key = date.toISOString().split("T")[0] || "";
    }
    grouped[key] = (grouped[key] || 0) + Number(payment.amount || 0);
  });

  return Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }));
};
