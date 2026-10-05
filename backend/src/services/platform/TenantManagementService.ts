// Responsibility: Platform-level tenant lifecycle management & root service facade

import { SupabaseClient } from "@supabase/supabase-js";
import { TenantCreateData } from "../../types/tenant.types";
import { logLifecycleEvent } from "./TenantLifecycleEventsService";

export * from "./TenantLifecycleEventsService";
export * from "./TenantLifecycleService";
export * from "./TenantSettingsService";

export const createTenant = async (
  supabase: SupabaseClient,
  tenantData: TenantCreateData,
  userId: string,
) => {
  const { data: hospital, error } = await supabase
    .from("hospitals")
    .insert({
      name: tenantData.name,
      address: tenantData.address,
      contact: tenantData.contact,
      license_info: tenantData.license_info,
      timezone: tenantData.timezone || "Asia/Kolkata",
      locale: tenantData.locale || "en",
      currency: tenantData.currency || "INR",
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;

  await logLifecycleEvent(
    supabase,
    hospital.id,
    {
      event_type: "created",
      metadata: { created_by: userId },
    },
    userId,
  );

  return hospital;
};

export const getAllTenants = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*, hospital_branding(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getTenantById = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*, hospital_branding(*), hospital_baa_documents(*)")
    .eq("id", hospitalId)
    .single();

  if (error) throw error;
  return data;
};
