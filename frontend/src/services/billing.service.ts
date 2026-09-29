// Responsibility: HTTP API calls and data transport for billing and invoices

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { Invoice } from "@/types";

export interface CreateInvoicePayload {
  patient_id: string;
  invoice_date: string;
  due_date?: string;
  payment_terms?: string;
  notes?: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    gst_rate?: number;
    item_type?: string;
    hsn_sac_code?: string;
    reference_type?: string;
    reference_id?: string;
  }>;
}

export const getHospitalInvoices = async (
  hospitalId: string,
): Promise<Invoice[]> => {
  const data = await api.get<Invoice[]>(
    API_ROUTES.hospitals.invoices(hospitalId),
  );
  return data || [];
};

export const createHospitalInvoice = async (
  hospitalId: string,
  payload: CreateInvoicePayload,
): Promise<Invoice> => {
  return api.post<Invoice>(API_ROUTES.hospitals.invoices(hospitalId), payload);
};
