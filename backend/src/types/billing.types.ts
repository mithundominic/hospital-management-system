// Responsibility: Billing, invoices, payments, and insurance database types
// backend/src/types/billing.types.ts

export interface Invoice {
  id: string;
  hospital_id: string;
  patient_id: string;
  encounter_id?: string;
  admission_id?: string;
  invoice_number: string;
  subtotal: number;
  cgst_total: number;
  sgst_total: number;
  total_amount: number;
  status: "draft" | "issued" | "paid" | "cancelled";
  issued_at?: string;
  due_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  cgst_amount?: number;
  sgst_amount?: number;
}

export interface Payment {
  id: string;
  hospital_id: string;
  invoice_id: string;
  amount: number;
  payment_method: "cash" | "card" | "upi" | "bank_transfer" | "insurance";
  reference_number?: string;
  received_by: string;
  notes?: string;
  paid_at: string;
}

export interface InsurancePolicy {
  id: string;
  patient_id: string;
  provider_name: string;
  tpa_name?: string;
  policy_number: string;
  valid_from: string;
  valid_to: string;
  coverage_details?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaim {
  id: string;
  hospital_id: string;
  invoice_id: string;
  insurance_policy_id: string;
  claim_type: "cashless" | "reimbursement";
  claimed_amount: number;
  approved_amount?: number;
  status: "submitted" | "pre_authorized" | "approved" | "rejected" | "settled";
  handled_by: string;
  submitted_at: string;
  resolved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
