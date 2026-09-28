// backend/src/routes/billing.ts
// Responsibility: Billing API routes - invoices and payments

import { Router } from 'express';
import { requireHospitalPermission } from '../middleware/requireHospitalPermission';
import { sendData } from '../utils/respond';
import { calculateInvoiceTotals, prepareLineItems } from '../services/billing/InvoiceCalculations';
import { AuthenticatedRequest, RouteHandler } from '../types';

const router = Router();

const getInvoices: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase
      .from('invoices')
      .select('*, invoice_line_items(*)')
      .eq('hospital_id', authReq.params.hospitalId);
    
    if (authReq.query.patient_id) {
      query = query.eq('patient_id', authReq.query.patient_id);
    }
    if (authReq.query.status) {
      query = query.eq('status', authReq.query.status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createInvoice: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { patient_id, encounter_id, admission_id, invoice_number, line_items = [] } = authReq.body;
    const totals = calculateInvoiceTotals(line_items);

    const { data: invoice, error: invError } = await authReq.supabase
      .from('invoices')
      .insert({
        hospital_id: authReq.params.hospitalId,
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
      const { data: liRows, error: liError } = await authReq.supabase
        .from('invoice_line_items')
        .insert(prepared)
        .select();
      if (liError) throw liError;
      lineItemRows = liRows;
    }

    sendData(res, { ...invoice, invoice_line_items: lineItemRows }, 201);
  } catch (err) {
    next(err);
  }
};

const updateInvoice: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from('invoices')
      .update(authReq.body)
      .eq('id', authReq.params.invId)
      .eq('hospital_id', authReq.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createPayment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { amount, payment_method, reference_number, received_by, notes } = authReq.body;
    const { data, error } = await authReq.supabase
      .from('payments')
      .insert({
        hospital_id: authReq.params.hospitalId,
        invoice_id: authReq.params.invId,
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
};

router.get('/hospitals/:hospitalId/invoices', requireHospitalPermission('billing.read'), getInvoices);
router.post('/hospitals/:hospitalId/invoices', requireHospitalPermission('billing.write'), createInvoice);
router.patch('/hospitals/:hospitalId/invoices/:invId', requireHospitalPermission('billing.write'), updateInvoice);
router.post('/hospitals/:hospitalId/invoices/:invId/payments', requireHospitalPermission('billing.write'), createPayment);

export default router;
