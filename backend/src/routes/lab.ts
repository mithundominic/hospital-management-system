// Responsibility: Lab orders and results routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getLabOrders: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase
      .from("lab_orders")
      .select("*, lab_results(*)")
      .eq("hospital_id", authReq.params.hospitalId);
    if (authReq.query.status)
      query = query.eq("status", authReq.query.status as string);
    const { data, error } = await query.order("ordered_at", {
      ascending: false,
    });
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createLabOrder: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { encounter_id, ordered_by, test_name } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("lab_orders")
      .insert({
        hospital_id: authReq.params.hospitalId,
        encounter_id,
        ordered_by,
        test_name,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateLabOrder: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("lab_orders")
      .update(authReq.body)
      .eq("id", authReq.params.orderId)
      .eq("hospital_id", authReq.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createLabResult: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      result_value,
      unit,
      reference_range,
      is_abnormal,
      verified_by,
      notes,
    } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("lab_results")
      .insert({
        lab_order_id: authReq.params.orderId,
        result_value,
        unit,
        reference_range,
        is_abnormal,
        verified_by,
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

router.get(
  "/hospitals/:hospitalId/lab-orders",
  requireHospitalPermission(PERMISSIONS.LAB_ORDERS_READ),
  getLabOrders,
);
router.post(
  "/hospitals/:hospitalId/lab-orders",
  requireHospitalPermission(PERMISSIONS.LAB_ORDERS_WRITE),
  createLabOrder,
);
router.patch(
  "/hospitals/:hospitalId/lab-orders/:orderId",
  requireHospitalPermission(PERMISSIONS.LAB_ORDERS_WRITE),
  updateLabOrder,
);
router.post(
  "/hospitals/:hospitalId/lab-orders/:orderId/results",
  requireHospitalPermission(PERMISSIONS.LAB_RESULTS_WRITE),
  createLabResult,
);

export default router;
