// Responsibility: Business logic and database operations for appointments

import { SupabaseClient } from "@supabase/supabase-js";
import type { Appointment } from "../../types";

export interface AppointmentFilters {
  doctor_membership_id?: string;
  patient_id?: string;
  date?: string;
}

export const queryAppointments = async (
  supabase: SupabaseClient,
  hospitalId: string,
  filters: AppointmentFilters = {},
) => {
  let query = supabase
    .from("appointments")
    .select(
      "id, hospital_id, patient_id, doctor_membership_id, department_id, scheduled_at, status, notes, created_at, updated_at",
    )
    .eq("hospital_id", hospitalId);

  if (filters.doctor_membership_id) {
    query = query.eq("doctor_membership_id", filters.doctor_membership_id);
  }
  if (filters.patient_id) {
    query = query.eq("patient_id", filters.patient_id);
  }
  if (filters.date) {
    query = query
      .gte("scheduled_at", `${filters.date}T00:00:00`)
      .lte("scheduled_at", `${filters.date}T23:59:59`);
  }

  const { data, error } = await query.order("scheduled_at", {
    ascending: true,
  });
  if (error) throw error;
  return data;
};

export const createNewAppointment = async (
  supabase: SupabaseClient,
  hospitalId: string,
  appointmentData: {
    patient_id: string;
    doctor_membership_id: string;
    department_id: string;
    scheduled_at: string;
    notes?: string;
  },
) => {
  const { data, error } = await supabase
    .from("appointments")
    .insert({ hospital_id: hospitalId, ...appointmentData })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateExistingAppointment = async (
  supabase: SupabaseClient,
  hospitalId: string,
  appointmentId: string,
  updates: Partial<Appointment>,
) => {
  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId)
    .eq("hospital_id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
