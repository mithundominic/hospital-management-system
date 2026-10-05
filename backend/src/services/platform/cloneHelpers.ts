// Responsibility: Helper functions for cloning specific resources

import { SupabaseClient } from "@supabase/supabase-js";

export const cloneDepartments = async (
  supabase: SupabaseClient,
  sourceId: string,
  targetId: string,
) => {
  const { data: departments, error: fetchError } = await supabase
    .from("departments")
    .select("name, description, head_doctor_id")
    .eq("hospital_id", sourceId);

  if (fetchError) throw fetchError;
  if (!departments || departments.length === 0) return;

  const deptInserts = departments.map((dept) => ({
    hospital_id: targetId,
    name: dept.name,
    description: dept.description,
    head_doctor_id: null,
  }));

  const { error: insertError } = await supabase
    .from("departments")
    .insert(deptInserts);

  if (insertError) throw insertError;
};

export const cloneBranding = async (
  supabase: SupabaseClient,
  sourceId: string,
  targetId: string,
) => {
  const { data: branding, error: fetchError } = await supabase
    .from("hospital_branding")
    .select("logo_url, color_scheme, custom_domain")
    .eq("hospital_id", sourceId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
  if (!branding) return;

  const { error: insertError } = await supabase
    .from("hospital_branding")
    .insert({
      hospital_id: targetId,
      logo_url: branding.logo_url,
      color_scheme: branding.color_scheme,
      custom_domain: null,
    });

  if (insertError) throw insertError;
};
