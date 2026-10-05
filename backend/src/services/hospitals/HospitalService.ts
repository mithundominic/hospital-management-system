// Responsibility: Business logic and data queries for hospital management

import { SupabaseClient } from "@supabase/supabase-js";
import type { Hospital, CreateHospitalDTO } from "../../types";

export const queryUserHospitals = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("id, name, registration_number, address, city, state, pincode, is_active, created_at, updated_at, memberships!inner(user_id, status)")
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
    .select("id, name, registration_number, address, city, state, pincode, is_active, created_at, updated_at")
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

export const createHospitalTenant = async (
  supabase: SupabaseClient,
  dto: CreateHospitalDTO,
) => {
  const { data, error } = await supabase.rpc("create_hospital_with_admin", {
    p_name: dto.name,
    p_registration_number: dto.registration_number || null,
    p_address: dto.address || null,
    p_city: dto.city || null,
    p_state: dto.state || null,
    p_pincode: dto.pincode || null,
  });
  if (error) throw error;
  return data;
};
