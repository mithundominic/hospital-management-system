// Responsibility: Platform-level hospital aggregation and statistical queries

import { SupabaseClient } from "@supabase/supabase-js";

export const queryAllHospitals = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.rpc("get_platform_hospitals_overview");
  if (!error && data) return data;

  const { data: fallback, error: fbError } = await supabase
    .from("hospitals")
    .select("*, memberships(id, user_id, role_id, status, created_at)")
    .order("created_at", { ascending: false });
  if (fbError) throw fbError;
  return fallback;
};

export const queryHospitalStats = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase.rpc("get_platform_hospital_stats", {
    p_hospital_id: hospitalId,
  });
  if (!error && data) return data;

  const [memberships, patients, appointments] = await Promise.all([
    supabase
      .from("memberships")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId)
      .eq("status", "active"),
    supabase
      .from("patient_registrations")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId),
    supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("hospital_id", hospitalId),
  ]);

  return {
    total_staff: memberships.count || 0,
    total_patients: patients.count || 0,
    total_appointments: appointments.count || 0,
  };
};

export const toggleHospitalStatus = async (
  supabase: SupabaseClient,
  hospitalId: string,
  isActive: boolean,
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .update({ is_active: isActive })
    .eq("id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
