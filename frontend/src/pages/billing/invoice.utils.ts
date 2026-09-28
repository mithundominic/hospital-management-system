// Responsibility: Pure calculation utility for invoice subtotals, GST splits, and totals

import type { InvoiceLineItemForm, InvoiceTotals } from "./invoice.types";

export const initialInvoiceLineItem: InvoiceLineItemForm = {
  description: "",
  quantity: "1",
  unit_price: "",
  hsn_sac_code: "",
  gst_rate: "18",
  reference_type: "service",
  reference_id: "",
};

export const calculateInvoiceTotals = (
  items: InvoiceLineItemForm[],
): InvoiceTotals => {
  let subtotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;
    const gstRate = Number(item.gst_rate) || 0;

    const lineTotal = qty * price;
    subtotal += lineTotal;
    taxTotal += (lineTotal * gstRate) / 100;
  }

  const halfTax = taxTotal / 2;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    cgst: Number(halfTax.toFixed(2)),
    sgst: Number(halfTax.toFixed(2)),
    total: Number((subtotal + taxTotal).toFixed(2)),
  };
};
