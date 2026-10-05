// Responsibility: Lookup user by biometric PIN in hospital

import { SupabaseClient } from "@supabase/supabase-js";

export const findUserByPin = async (
  supabase: SupabaseClient,
  hospitalId: string,
  biometricPin: string,
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("employee_pin_mappings")
    .select("user_id")
    .eq("hospital_id", hospitalId)
    .eq("biometric_pin", biometricPin)
    .maybeSingle();

  if (error) throw error;
  return data?.user_id || null;
};
