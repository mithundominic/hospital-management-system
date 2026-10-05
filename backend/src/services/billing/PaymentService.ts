// Responsibility: Business logic and data queries for payment recording

import { SupabaseClient } from "@supabase/supabase-js";
import type { Payment } from "../../types";

export const recordPayment = async (
  supabase: SupabaseClient,
  hospitalId: string,
  invoiceId: string,
  paymentData: Omit<Payment, "id" | "hospital_id" | "invoice_id" | "paid_at">,
) => {
  const { data, error } = await supabase
    .from("payments")
    .insert({ hospital_id: hospitalId, invoice_id: invoiceId, ...paymentData })
    .select()
    .single();
  if (error) throw error;
  return data;
};
