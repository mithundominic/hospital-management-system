// Responsibility: Business logic and data queries for hospital invoices and payments

import { SupabaseClient } from "@supabase/supabase-js";
import {
  calculateInvoiceTotals,
  prepareLineItems,
} from "./InvoiceCalculations";
import type { Invoice, InvoiceLineItem, Payment } from "../../types";

export const queryInvoices = async (
  supabase: SupabaseClient,
  hospitalId: string,
  patientId?: string,
  status?: string,
) => {
  let query = supabase
    .from("invoices")
    .select("*, invoice_line_items(*)")
    .eq("hospital_id", hospitalId);

  if (patientId) query = query.eq("patient_id", patientId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const createNewInvoice = async (
  supabase: SupabaseClient,
  hospitalId: string,
  invoiceData: {
    patient_id: string;
    encounter_id?: string;
    admission_id?: string;
    invoice_number: string;
    line_items?: Array<{
      item_type: string;
      description: string;
      quantity: number;
      unit_price: number;
    }>;
  },
) => {
  const { line_items = [], ...rest } = invoiceData;
  const totals = calculateInvoiceTotals(line_items);

  const { data: invoice, error: invError } = await supabase
    .from("invoices")
    .insert({ hospital_id: hospitalId, ...rest, ...totals })
    .select()
    .single();
  if (invError) throw invError;

  let lineItemRows: InvoiceLineItem[] = [];
  if (line_items.length > 0) {
    const prepared = prepareLineItems(line_items, invoice.id);
    const { data: liRows, error: liError } = await supabase
      .from("invoice_line_items")
      .insert(prepared)
      .select();
    if (liError) throw liError;
    lineItemRows = liRows;
  }

  return { ...invoice, invoice_line_items: lineItemRows };
};

export const updateExistingInvoice = async (
  supabase: SupabaseClient,
  hospitalId: string,
  invoiceId: string,
  updates: Partial<Invoice>,
) => {
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", invoiceId)
    .eq("hospital_id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

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
