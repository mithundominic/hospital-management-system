// Responsibility: Patient prescription queries

import { SupabaseClient } from "@supabase/supabase-js";

export const queryMyPrescriptions = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("prescriptions")
    .select(
      `
      id,
      prescription_date,
      notes,
      prescription_items (
        id,
        medication_name,
        dosage,
        frequency,
        duration_days,
        instructions
      ),
      encounter:encounter_id (
        encounter_date,
        diagnosis,
        doctor_membership:doctor_membership_id (
          doctor:doctor_profiles (
            full_name,
            specialization
          )
        ),
        patient_registration:patient_registration_id (
          hospital:hospital_id (
            name
          )
        )
      )
    `,
    )
    .order("prescription_date", { ascending: false });

  if (error) throw error;
  return data;
};
