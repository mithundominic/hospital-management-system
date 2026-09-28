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
  invoice_date: string;
  due_date?: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  notes?: string;
  created_at: string;
  line_items?: InvoiceLineItem[];
}

export interface InsuranceClaim {
  id: string;
  hospital_id: string;
  policy_id: string;
  claim_number: string;
  claim_date: string;
  claim_amount: number;
  approved_amount?: number;
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "settled";
  claim_type: "cashless" | "reimbursement";
  diagnosis?: string;
  treatment_details?: string;
  submitted_documents?: string[];
  approval_date?: string;
  settlement_date?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface RevenueData {
  date: string;
  total_amount: number;
}
