// Responsibility: Business logic for employee PIN mappings

import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeePinMapping {
  id: string;
  hospital_id: string;
  user_id: string;
  biometric_pin: string;
  created_at: string;
}

export const listPinMappings = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("employee_pin_mappings")
    .select("*, user:auth.users(email)")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getPinMapping = async (
  supabase: SupabaseClient,
  mappingId: string,
) => {
  const { data, error } = await supabase
    .from("employee_pin_mappings")
    .select("*, user:auth.users(email)")
    .eq("id", mappingId)
    .single();

  if (error) throw error;
  return data;
};

export const createPinMapping = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
  biometricPin: string,
) => {
  const { data, error } = await supabase
    .from("employee_pin_mappings")
    .insert({
      hospital_id: hospitalId,
      user_id: userId,
      biometric_pin: biometricPin,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePinMapping = async (
  supabase: SupabaseClient,
  mappingId: string,
  biometricPin: string,
) => {
  const { data, error } = await supabase
    .from("employee_pin_mappings")
    .update({ biometric_pin: biometricPin })
    .eq("id", mappingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePinMapping = async (
  supabase: SupabaseClient,
  mappingId: string,
) => {
  const { error } = await supabase
    .from("employee_pin_mappings")
    .delete()
    .eq("id", mappingId);

  if (error) throw error;
};

export const findUserByPin = async (
  supabase: SupabaseClient,
  hospitalId: string,
  biometricPin: string,
) => {
  const { data, error } = await supabase
    .from("employee_pin_mappings")
    .select("user_id")
    .eq("hospital_id", hospitalId)
    .eq("biometric_pin", biometricPin)
    .maybeSingle();

  if (error) throw error;
  return data?.user_id || null;
};
