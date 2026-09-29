// Responsibility: Billing API routes delegating to BillingService
// backend/src/routes/billing.ts

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryInvoices,
  createNewInvoice,
  updateExistingInvoice,
  recordPayment,
} from "../services/billing/BillingService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = Router();

const getInvoices: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryInvoices(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.query.patient_id as string | undefined,
      authReq.query.status as string | undefined,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createInvoice: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const invoice = await createNewInvoice(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, invoice, 201);
  } catch (err) {
    next(err);
  }
};

const updateInvoice: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingInvoice(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.invId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createPayment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await recordPayment(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.invId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

router.get(
  API_ROUTES.billing.invoices,
  requireHospitalPermission(PERMISSIONS.BILLING_READ),
  getInvoices,
);
router.post(
  API_ROUTES.billing.invoices,
  requireHospitalPermission(PERMISSIONS.BILLING_WRITE),
  createInvoice,
);
router.patch(
  API_ROUTES.billing.invoiceDetail,
  requireHospitalPermission(PERMISSIONS.BILLING_WRITE),
  updateInvoice,
);
router.post(
  API_ROUTES.billing.payments,
  requireHospitalPermission(PERMISSIONS.BILLING_WRITE),
  createPayment,
);

export default router;
