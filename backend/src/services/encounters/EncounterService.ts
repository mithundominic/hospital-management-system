// Responsibility: Business logic and database operations for clinical encounters
// backend/src/services/encounters/EncounterService.ts

import { SupabaseClient } from "@supabase/supabase-js";
import type { Encounter } from "../../types";

export const queryEncounters = async (
  supabase: SupabaseClient,
  hospitalId: string,
  patientId?: string,
) => {
  let query = supabase
    .from("encounters")
    .select("*")
    .eq("hospital_id", hospitalId);

  if (patientId) query = query.eq("patient_id", patientId);

  const { data, error } = await query.order("started_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const createNewEncounter = async (
  supabase: SupabaseClient,
  hospitalId: string,
  encounterData: Omit<
    Encounter,
    "id" | "hospital_id" | "created_at" | "updated_at"
  >,
) => {
  const { data, error } = await supabase
    .from("encounters")
    .insert({ hospital_id: hospitalId, ...encounterData })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateExistingEncounter = async (
  supabase: SupabaseClient,
  hospitalId: string,
  encounterId: string,
  updates: Partial<Encounter>,
) => {
  const { data, error } = await supabase
    .from("encounters")
    .update(updates)
    .eq("id", encounterId)
    .eq("hospital_id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const queryPrescriptions = async (
  supabase: SupabaseClient,
  hospitalId: string,
  encounterId: string,
) => {
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*, prescription_items(*)")
    .eq("encounter_id", encounterId)
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};
