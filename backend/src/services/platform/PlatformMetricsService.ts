// Responsibility: Platform metrics for hospital comparisons and staff distribution

import { SupabaseClient } from "@supabase/supabase-js";

interface RoleMembership {
  role_id: string;
  roles: { name: string } | null;
}

export const getHospitalComparison = async (supabase: SupabaseClient) => {
  const { data: hospitals, error } = await supabase
    .from("hospitals")
    .select("id, name");
  if (error) throw error;

  const results = await Promise.all(
    hospitals.map(async (hospital) => {
      const [patients, staff, appointments, payments] = await Promise.all([
        supabase
          .from("patient_registrations")
          .select("id", { count: "exact" })
          .eq("hospital_id", hospital.id),
        supabase
          .from("memberships")
          .select("id", { count: "exact" })
          .eq("hospital_id", hospital.id),
        supabase
          .from("appointments")
          .select("id", { count: "exact" })
          .eq("hospital_id", hospital.id),
        supabase
          .from("invoices")
          .select("total_amount")
          .eq("hospital_id", hospital.id),
      ]);

      return {
        hospital_id: hospital.id,
        hospital_name: hospital.name,
        patient_count: patients.count || 0,
        staff_count: staff.count || 0,
        appointments_count: appointments.count || 0,
        revenue:
          payments.data?.reduce(
            (sum, p) => sum + Number(p.total_amount || 0),
            0,
          ) || 0,
      };
    }),
  );

  return results;
};

export const getStaffDistribution = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("memberships")
    .select("role_id, roles(name)")
    .eq("status", "active");

  if (error) throw error;

  const distribution: Record<string, number> = {};
  const memberships = (data || []) as unknown as RoleMembership[];

  memberships.forEach((membership) => {
    const roleName = membership.roles?.name || "Unknown";
    distribution[roleName] = (distribution[roleName] || 0) + 1;
  });

  return Object.entries(distribution).map(([role, count]) => ({ role, count }));
};
