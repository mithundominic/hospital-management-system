// Responsibility: Business logic and data queries for ABDM verification and consent workflows

import { SupabaseClient } from "@supabase/supabase-js";
import { AbdmClient } from "../AbdmClient";

const abdmClient = new AbdmClient();

export const queryLinkRequests = async (
  supabase: SupabaseClient,
  hospitalId: string,
  patientId: string,
) => {
  const { data, error } = await supabase
    .from("abdm_link_requests")
    .select("*")
    .eq("hospital_id", hospitalId)
    .eq("patient_id", patientId);
  if (error) throw error;
  return data;
};

export const initiateAbhaVerificationWorkflow = async (
  supabase: SupabaseClient,
  hospitalId: string,
  patientId: string,
  abhaAddress: string,
) => {
  const { data: linkRequest, error } = await supabase
    .from("abdm_link_requests")
    .insert({
      hospital_id: hospitalId,
      patient_id: patientId,
      link_type: "abha_verification",
      status: "initiated",
    })
    .select()
    .single();
  if (error) throw error;

  const abdmResponse = await abdmClient.initiateAbhaVerification({
    abhaAddress,
    hospitalId,
    patientId,
  });

  await supabase
    .from("abdm_link_requests")
    .update({ abdm_request_id: abdmResponse.transactionId })
    .eq("id", linkRequest.id);

  return { ...linkRequest, abdm_request_id: abdmResponse.transactionId };
};

export const confirmAbhaVerificationWorkflow = async (
  transactionId: string,
  otp: string,
) => {
  return abdmClient.confirmAbhaLink({ transactionId, otp });
};

export const requestConsentWorkflow = async (
  supabase: SupabaseClient,
  hospitalId: string,
  patientId: string,
  abhaAddress: string,
  purpose: string,
) => {
  const { data: artifact, error } = await supabase
    .from("abdm_consent_artifacts")
    .insert({
      hospital_id: hospitalId,
      patient_id: patientId,
      purpose,
      status: "requested",
    })
    .select()
    .single();
  if (error) throw error;

  const abdmResponse = await abdmClient.requestConsent({
    abhaAddress,
    purpose,
    hospitalId,
  });

  const responseWithConsent = abdmResponse as {
    consentRequest?: { id: string };
  };
  const consentRequestId = responseWithConsent?.consentRequest?.id;
  if (consentRequestId) {
    await supabase
      .from("abdm_consent_artifacts")
      .update({ consent_request_id: consentRequestId })
      .eq("id", artifact.id);
  }

  return artifact;
};
