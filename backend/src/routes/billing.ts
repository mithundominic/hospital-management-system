// Responsibility: Billing API routes delegating to BillingService
// backend/src/routes/billing.ts

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryInvoices, createNewInvoice, updateExistingInvoice, recordPayment,
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
  "/hospitals/:hospitalId/invoices",
  requireHospitalPermission(PERMISSIONS.BILLING_READ),
  getInvoices,
);
router.post(
  "/hospitals/:hospitalId/invoices",
  requireHospitalPermission(PERMISSIONS.BILLING_WRITE),
  createInvoice,
);
router.patch(
  "/hospitals/:hospitalId/invoices/:invId",
  requireHospitalPermission(PERMISSIONS.BILLING_WRITE),
  updateInvoice,
);
router.post(
  "/hospitals/:hospitalId/invoices/:invId/payments",
  requireHospitalPermission(PERMISSIONS.BILLING_WRITE),
  createPayment,
);

export default router;
