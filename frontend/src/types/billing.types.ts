// Responsibility: TypeScript interfaces for billing and insurance concepts

export interface InvoiceLineItem {
  id?: string;
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  hospital_id: string;
  patient_id: string;
  invoice_number: string;
  invoice_date?: string;
  issued_at?: string;
  due_date?: string;
  due_at?: string;
  subtotal?: number;
  subtotal_amount?: number;
  cgst_total?: number;
  sgst_total?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
  line_items?: InvoiceLineItem[];
}

export interface InsuranceClaim {
  id: string;
  hospital_id: string;
  policy_id?: string;
  insurance_policy_id?: string;
  invoice_id?: string;
  claim_number: string;
  claim_date?: string;
  submitted_at?: string;
  claim_amount?: number;
  claimed_amount?: number | string;
  approved_amount?: number | string;
  status: string;
  claim_type: "cashless" | "reimbursement" | string;
  diagnosis?: string;
  treatment_details?: string;
  submitted_documents?: string[];
  approval_date?: string;
  settlement_date?: string;
  settled_at?: string;
  rejection_reason?: string;
  created_at?: string;
}

export interface RevenueData {
  date: string;
  total_amount: number;
}
