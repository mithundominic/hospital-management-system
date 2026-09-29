// Responsibility: Business logic and database operations for lab orders and insert-only results

import { SupabaseClient } from "@supabase/supabase-js";
import type { LabOrder } from "../../types";

export const queryLabOrders = async (
  supabase: SupabaseClient,
  hospitalId: string,
  status?: string,
) => {
  let query = supabase
    .from("lab_orders")
    .select("*, lab_results(*)")
    .eq("hospital_id", hospitalId);

  if (status) query = query.eq("status", status);

  const { data, error } = await query.order("ordered_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const createNewLabOrder = async (
  supabase: SupabaseClient,
  hospitalId: string,
  orderData: {
    encounter_id: string;
    ordered_by: string;
    test_name: string;
  },
) => {
  const { data, error } = await supabase
    .from("lab_orders")
    .insert({
      hospital_id: hospitalId,
      encounter_id: orderData.encounter_id,
      ordered_by: orderData.ordered_by,
      test_name: orderData.test_name,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateExistingLabOrder = async (
  supabase: SupabaseClient,
  hospitalId: string,
  orderId: string,
  updates: Partial<LabOrder>,
) => {
  const { data, error } = await supabase
    .from("lab_orders")
    .update(updates)
    .eq("id", orderId)
    .eq("hospital_id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const recordLabResult = async (
  supabase: SupabaseClient,
  orderId: string,
  resultData: {
    result_value: string;
    unit?: string;
    reference_range?: string;
    is_abnormal?: boolean;
    verified_by: string;
    notes?: string;
  },
) => {
  const { data, error } = await supabase
    .from("lab_results")
    .insert({
      lab_order_id: orderId,
      result_value: resultData.result_value,
      unit: resultData.unit,
      reference_range: resultData.reference_range,
      is_abnormal: resultData.is_abnormal ?? false,
      verified_by: resultData.verified_by,
      notes: resultData.notes,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
