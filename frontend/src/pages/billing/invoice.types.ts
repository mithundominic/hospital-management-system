// Responsibility: TypeScript interfaces for invoice creation, items, and tax calculations

import type { Invoice } from '@/types';

export interface InvoiceLineItemForm {
  description: string;
  quantity: string;
  unit_price: string;
  hsn_sac_code: string;
  gst_rate: string;
  reference_type: string;
  reference_id: string;
}

export interface InvoiceTotals {
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface InvoiceFormData {
  patient_id: string;
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  notes: string;
}

export interface InvoiceFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  invoice?: Invoice | null;
}
