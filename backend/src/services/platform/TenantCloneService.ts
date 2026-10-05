// Responsibility: Clone tenant configuration for franchises

import { SupabaseClient } from "@supabase/supabase-js";
import { cloneDepartments, cloneBranding } from "./cloneHelpers";

interface CloneData {
  name: string;
  address?: string;
  contact?: string;
}

export const cloneTenant = async (
  supabase: SupabaseClient,
  sourceHospitalId: string,
  cloneData: CloneData,
  userId: string,
) => {
  const { data: sourceHospital, error: sourceError } = await supabase
    .from("hospitals")
    .select("*")
    .eq("id", sourceHospitalId)
    .single();

  if (sourceError) throw sourceError;

  const { data: newHospital, error: insertError } = await supabase
    .from("hospitals")
    .insert({
      name: cloneData.name,
      address: cloneData.address || sourceHospital.address,
      contact: cloneData.contact || sourceHospital.contact,
      license_info: sourceHospital.license_info,
      timezone: sourceHospital.timezone,
      locale: sourceHospital.locale,
      currency: sourceHospital.currency,
      status: "active",
    })
    .select()
    .single();

  if (insertError) throw insertError;

  await Promise.all([
    cloneDepartments(supabase, sourceHospitalId, newHospital.id),
    cloneBranding(supabase, sourceHospitalId, newHospital.id),
  ]);

  await supabase.from("hospital_lifecycle_events").insert({
    hospital_id: newHospital.id,
    event_type: "created",
    metadata: { cloned_from: sourceHospitalId },
    created_by: userId,
  });

  return newHospital;
};
