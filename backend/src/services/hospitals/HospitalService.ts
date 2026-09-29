// Responsibility: Business logic and data queries for hospital management

import { SupabaseClient } from "@supabase/supabase-js";
import type { Hospital } from "../../types";

export const queryUserHospitals = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*, memberships!inner(user_id, status)")
    .eq("memberships.user_id", userId)
    .eq("memberships.status", "active");
  if (error) throw error;
  return data;
};

export const queryHospitalById = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*")
    .eq("id", hospitalId)
    .single();
  if (error) throw error;
  return data;
};

export const updateHospitalDetails = async (
  supabase: SupabaseClient,
  hospitalId: string,
  updates: Partial<Hospital>,
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .update(updates)
    .eq("id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
