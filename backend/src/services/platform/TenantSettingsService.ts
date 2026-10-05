// Responsibility: Service for managing tenant settings and branding

import { SupabaseClient } from "@supabase/supabase-js";
import { TenantUpdateData, BrandingData } from "../../types/tenant.types";

export const updateTenantSettings = async (
  supabase: SupabaseClient,
  hospitalId: string,
  updates: TenantUpdateData,
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

export const updateBranding = async (
  supabase: SupabaseClient,
  hospitalId: string,
  branding: BrandingData,
) => {
  const { data, error } = await supabase
    .from("hospital_branding")
    .upsert({
      hospital_id: hospitalId,
      ...branding,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
