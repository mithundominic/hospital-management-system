// src/routes/billing.js
// Responsibility: Billing API routes - invoices and payments

const express = require("express");
const {
  requireHospitalPermission,
} = require("../middleware/requireHospitalPermission");
const { sendData } = require("../utils/respond");
const {
  calculateInvoiceTotals,
  prepareLineItems,
} = require("../services/billing/InvoiceCalculations");

const router = express.Router();

router.get(
  "/hospitals/:hospitalId/invoices",
  requireHospitalPermission("billing.read"),
  async (req, res, next) => {
    try {
      let query = req.supabase
        .from("invoices")
        .select("*, invoice_line_items(*)")
        .eq("hospital_id", req.params.hospitalId);
      if (req.query.patient_id)
        query = query.eq("patient_id", req.query.patient_id);
      if (req.query.status) query = query.eq("status", req.query.status);
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/hospitals/:hospitalId/invoices",
  requireHospitalPermission("billing.write"),
  async (req, res, next) => {
    try {
      const {
        patient_id,
        encounter_id,
        admission_id,
        invoice_number,
        line_items = [],
      } = req.body;
      const totals = calculateInvoiceTotals(line_items);

      const { data: invoice, error: invError } = await req.supabase
        .from("invoices")
        .insert({
          hospital_id: req.params.hospitalId,
          patient_id,
          encounter_id,
          admission_id,
          invoice_number,
          ...totals,
        })
        .select()
        .single();
      if (invError) throw invError;

      let lineItemRows = [];
      if (line_items.length > 0) {
        const prepared = prepareLineItems(line_items, invoice.id);
        const { data: liRows, error: liError } = await req.supabase
          .from("invoice_line_items")
          .insert(prepared)
          .select();
        if (liError) throw liError;
        lineItemRows = liRows;
      }

      sendData(res, { ...invoice, invoice_line_items: lineItemRows }, 201);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/hospitals/:hospitalId/invoices/:invId",
  requireHospitalPermission("billing.write"),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from("invoices")
        .update(req.body)
        .eq("id", req.params.invId)
        .eq("hospital_id", req.params.hospitalId)
        .select()
        .single();
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/hospitals/:hospitalId/invoices/:invId/payments",
  requireHospitalPermission("billing.write"),
  async (req, res, next) => {
    try {
      const { amount, payment_method, reference_number, received_by, notes } =
        req.body;
      const { data, error } = await req.supabase
        .from("payments")
        .insert({
          hospital_id: req.params.hospitalId,
          invoice_id: req.params.invId,
          amount,
          payment_method,
          reference_number,
          received_by,
          notes,
        })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
