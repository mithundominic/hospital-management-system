// Responsibility: Patient portal data access - lab results

import { SupabaseClient } from "@supabase/supabase-js";

export const queryMyLabResults = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("lab_results")
    .select(
      `
      id,
      test_name,
      result_value,
      reference_range,
      status,
      result_date,
      notes,
      lab_order:lab_order_id (
        encounter:encounter_id (
          encounter_date,
          patient_registration:patient_registration_id (
            hospital:hospital_id (
              name
            )
          )
        )
      )
    `,
    )
    .order("result_date", { ascending: false });

  if (error) throw error;
  return data;
};
