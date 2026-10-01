// Responsibility: M2 Care Context linking workflow logic

import { SupabaseClient } from "@supabase/supabase-js";
import { AbdmClient } from "../AbdmClient";

const abdmClient = new AbdmClient();

export const linkCareContextWorkflow = async (
  supabase: SupabaseClient,
  hospitalId: string,
  patientId: string,
  encounterId: string,
  abhaAddress: string,
  careContextReference: string,
) => {
  // 1. Validate encounter exists and belongs to patient/hospital
  const { data: encounter, error: encError } = await supabase
    .from("encounters")
    .select("id, hospital_id, patient_id")
    .eq("id", encounterId)
    .eq("hospital_id", hospitalId)
    .eq("patient_id", patientId)
    .single();
  if (encError || !encounter) {
    throw new Error("Encounter not found or does not belong to patient");
  }

  // 2. Create link request record
  const { data: linkRequest, error } = await supabase
    .from("abdm_link_requests")
    .insert({
      hospital_id: hospitalId,
      patient_id: patientId,
      link_type: "care_context",
      status: "initiated",
    })
    .select()
    .single();
  if (error) throw error;

  // 3. Call ABDM M2 service
  const abdmResponse = await abdmClient.linkCareContext({
    abhaAddress,
    hospitalId,
    encounterId,
    careContextReference,
  });

  // 4. Update link request with ABDM request ID
  const requestId = (abdmResponse as { requestId?: string })?.requestId;
  if (requestId) {
    await supabase
      .from("abdm_link_requests")
      .update({ abdm_request_id: requestId })
      .eq("id", linkRequest.id);
  }

  return { ...linkRequest, abdm_request_id: requestId };
};
