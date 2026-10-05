// Responsibility: Export tenant data in JSON/CSV formats

import { SupabaseClient } from "@supabase/supabase-js";
import { jsonToCSV } from "../../utils/csvExport";

export const exportTenantData = async (
  supabase: SupabaseClient,
  hospitalId: string,
  format: "json" | "csv" = "json",
) => {
  const [hospital, branding, baaDocuments, lifecycleEvents, departments] =
    await Promise.all([
      supabase.from("hospitals").select("*").eq("id", hospitalId).single(),
      supabase
        .from("hospital_branding")
        .select("*")
        .eq("hospital_id", hospitalId),
      supabase
        .from("hospital_baa_documents")
        .select("*")
        .eq("hospital_id", hospitalId),
      supabase
        .from("hospital_lifecycle_events")
        .select("*")
        .eq("hospital_id", hospitalId),
      supabase.from("departments").select("*").eq("hospital_id", hospitalId),
    ]);

  const exportData = {
    hospital: hospital.data,
    branding: branding.data?.[0] || null,
    baa_documents: baaDocuments.data || [],
    lifecycle_events: lifecycleEvents.data || [],
    departments: departments.data || [],
  };

  if (format === "csv") {
    return jsonToCSV(exportData);
  }

  return exportData;
};
