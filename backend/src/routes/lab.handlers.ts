// Responsibility: Route handler implementations for lab orders and results

import { sendData } from "../utils/respond";
import {
  queryLabOrders,
  createNewLabOrder,
  updateExistingLabOrder,
  recordLabResult,
} from "../services/lab/LabService";
import { AuthenticatedRequest, RouteHandler } from "../types";

export const getLabOrders: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryLabOrders(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.query.status as string | undefined,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createLabOrder: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createNewLabOrder(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateLabOrder: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingLabOrder(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.orderId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createLabResult: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await recordLabResult(
      authReq.supabase,
      authReq.params.orderId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};
