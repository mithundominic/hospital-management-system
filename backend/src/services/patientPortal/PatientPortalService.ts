// Responsibility: Patient portal data access and business logic

import { SupabaseClient } from "@supabase/supabase-js";

export const queryMyAppointments = async (
  supabase: SupabaseClient,
  filters?: { status?: string; from_date?: string },
) => {
  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      appointment_time,
      status,
      reason,
      notes,
      doctor_membership:doctor_membership_id (
        id,
        doctor:doctor_profiles (
          full_name,
          specialization
        )
      ),
      department:department_id (
        name
      ),
      patient_registration:patient_registration_id (
        hospital:hospital_id (
          name
        )
      )
    `,
    )
    .order("appointment_date", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.from_date) {
    query = query.gte("appointment_date", filters.from_date);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const createAppointmentRequest = async (
  supabase: SupabaseClient,
  appointmentData: {
    patient_registration_id: string;
    department_id?: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
  },
) => {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      ...appointmentData,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const queryMyLabResults = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("lab_results")
    .select(
      `
      id,
      test_name,
      result_value,
      reference_range,
      status,
      result_date,
      notes,
      lab_order:lab_order_id (
        encounter:encounter_id (
          encounter_date,
          patient_registration:patient_registration_id (
            hospital:hospital_id (
              name
            )
          )
        )
      )
    `,
    )
    .order("result_date", { ascending: false });

  if (error) throw error;
  return data;
};
