// backend/src/services/billing/InvoiceCalculations.js
// Responsibility: Invoice total calculations and line item processing

/**
 * Calculate invoice totals from line items
 * @param {Array} lineItems - Array of invoice line items
 * @returns {Object} Calculated totals
 */
function calculateInvoiceTotals(lineItems = []) {
  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unit_price, 0);
  const cgst_total = lineItems.reduce((sum, li) => sum + (li.cgst_amount || 0), 0);
  const sgst_total = lineItems.reduce((sum, li) => sum + (li.sgst_amount || 0), 0);
  const total_amount = subtotal + cgst_total + sgst_total;

  return { subtotal, cgst_total, sgst_total, total_amount };
}

/**
 * Prepare line items for database insertion
 * @param {Array} lineItems - Raw line items from request
 * @param {string} invoiceId - Associated invoice ID
 * @returns {Array} Prepared line items with computed fields
 */
function prepareLineItems(lineItems, invoiceId) {
  return lineItems.map((li) => ({
    ...li,
    invoice_id: invoiceId,
    line_total: li.quantity * li.unit_price,
  }));
}

module.exports = { calculateInvoiceTotals, prepareLineItems };
