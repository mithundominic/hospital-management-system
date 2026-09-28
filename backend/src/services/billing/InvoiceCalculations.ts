// backend/src/services/billing/InvoiceCalculations.ts
// Responsibility: Invoice total calculations and line item processing

interface InvoiceTotals {
  subtotal: number;
  cgst_total: number;
  sgst_total: number;
  total_amount: number;
}

interface RawLineItem {
  quantity: number;
  unit_price: number;
  cgst_amount?: number;
  sgst_amount?: number;
  [key: string]: unknown;
}

interface PreparedLineItem extends RawLineItem {
  invoice_id: string;
  line_total: number;
}

/**
 * Calculate invoice totals from line items
 * @param lineItems - Array of invoice line items
 * @returns Calculated totals
 */
export function calculateInvoiceTotals(lineItems: RawLineItem[] = []): InvoiceTotals {
  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unit_price, 0);
  const cgst_total = lineItems.reduce((sum, li) => sum + (li.cgst_amount || 0), 0);
  const sgst_total = lineItems.reduce((sum, li) => sum + (li.sgst_amount || 0), 0);
  const total_amount = subtotal + cgst_total + sgst_total;

  return { subtotal, cgst_total, sgst_total, total_amount };
}

/**
 * Prepare line items for database insertion
 * @param lineItems - Raw line items from request
 * @param invoiceId - Associated invoice ID
 * @returns Prepared line items with computed fields
 */
export function prepareLineItems(
  lineItems: RawLineItem[],
  invoiceId: string
): PreparedLineItem[] {
  return lineItems.map((li) => ({
    ...li,
    invoice_id: invoiceId,
    line_total: li.quantity * li.unit_price,
  }));
}
