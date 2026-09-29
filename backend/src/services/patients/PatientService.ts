// Responsibility: Business logic and data queries for patient management and registrations

import { SupabaseClient } from "@supabase/supabase-js";
import type { Patient } from "../../types";

export interface CreatePatientInput {
  full_name: string;
  dob: string;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  blood_group?: string;
  hospital_patient_number?: string;
}

export const queryHospitalPatients = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("patient_registrations")
    .select("hospital_patient_number, registered_at, patients(*)")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};

export const queryPatientById = async (
  supabase: SupabaseClient,
  patientId: string,
) => {
  const { data, error } = await supabase
    .from("patients")
    .select("*, patient_registrations(*)")
    .eq("id", patientId)
    .single();
  if (error) throw error;
  return data;
};

export const registerNewPatient = async (
  supabase: SupabaseClient,
  hospitalId: string,
  input: CreatePatientInput,
) => {
  const {
    full_name,
    dob,
    gender,
    phone,
    email,
    blood_group,
    hospital_patient_number,
  } = input;

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert({ full_name, dob, gender, phone, email, blood_group })
    .select()
    .single();
  if (patientError) throw patientError;

  const { data: registration, error: regError } = await supabase
    .from("patient_registrations")
    .insert({
      patient_id: patient.id,
      hospital_id: hospitalId,
      hospital_patient_number,
    })
    .select()
    .single();
  if (regError) throw regError;

  return { ...patient, registration };
};

export const updateExistingPatient = async (
  supabase: SupabaseClient,
  patientId: string,
  updates: Partial<Patient>,
) => {
  const { data, error } = await supabase
    .from("patients")
    .update(updates)
    .eq("id", patientId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
