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

  static async fetchPatientData(patientId: string, hospitalId: string) {
    const { data } = await adminClient
      .from("patient_registrations")
      .select("patients(*)")
      .eq("patient_id", patientId)
      .eq("hospital_id", hospitalId)
      .single();

    if (!data || !data.patients) return null;
    return data.patients as unknown as Record<string, unknown>;
  }

  static async fetchLatestEncounter(patientId: string, hospitalId: string) {
    const { data } = await adminClient
      .from("encounters")
      .select("*")
      .eq("patient_id", patientId)
      .eq("hospital_id", hospitalId)
      .order("encounter_date", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }

  static async fetchPrescriptionItems(encounterId: string) {
    const { data: prescription } = await adminClient
      .from("prescriptions")
      .select("id")
      .eq("encounter_id", encounterId)
      .maybeSingle();

    if (!prescription) return [];

    const { data } = await adminClient
      .from("prescription_items")
      .select("*")
      .eq("prescription_id", prescription.id);
    return data || [];
  }

  static async fetchLabData(encounterId: string, hospitalId: string) {
    const { data: order } = await adminClient
      .from("lab_orders")
      .select("*")
      .eq("encounter_id", encounterId)
      .eq("hospital_id", hospitalId)
      .maybeSingle();

    if (!order) return null;

    const { data: results } = await adminClient
      .from("lab_results")
      .select("*")
      .eq("order_id", order.id);

    return { order, results: results || [] };
  }
}
