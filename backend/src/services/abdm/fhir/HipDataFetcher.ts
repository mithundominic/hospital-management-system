// Responsibility: Fetch patient health data from database for FHIR bundle construction

import { adminClient } from "../../../config/supabase";

export class HipDataFetcher {
  static async fetchConsentArtifact(id: string) {
    const { data } = await adminClient
      .from("abdm_consent_artifacts")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  }

  static async fetchPatientData(patientId: string) {
    const { data } = await adminClient
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();
    return data;
  }

  static async fetchLatestEncounter(patientId: string) {
    const { data } = await adminClient
      .from("encounters")
      .select("*")
      .eq("patient_id", patientId)
      .order("encounter_date", { ascending: false })
      .limit(1)
      .single();
    return data;
  }

  static async fetchPrescriptionItems(encounterId: string) {
    const { data } = await adminClient
      .from("prescription_items")
      .select("*")
      .eq("encounter_id", encounterId);
    return data || [];
  }

  static async fetchLabData(encounterId: string) {
    const { data: order } = await adminClient
      .from("lab_orders")
      .select("*")
      .eq("encounter_id", encounterId)
      .single();

    if (!order) return null;

    const { data: results } = await adminClient
      .from("lab_results")
      .select("*")
      .eq("order_id", order.id);

    return { order, results: results || [] };
  }
}
