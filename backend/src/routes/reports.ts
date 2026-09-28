// Responsibility: Hospital reports routes (bed occupancy, revenue, low stock)

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getBedOccupancy: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("bed_occupancy_summary")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getDailyRevenue: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase
      .from("daily_revenue_summary")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);
    if (authReq.query.from)
      query = query.gte("revenue_date", authReq.query.from as string);
    if (authReq.query.to)
      query = query.lte("revenue_date", authReq.query.to as string);
    const { data, error } = await query.order("revenue_date", {
      ascending: false,
    });
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getLowStock: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("low_stock_alert")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  "/hospitals/:hospitalId/reports/bed-occupancy",
  requireHospitalPermission(PERMISSIONS.REPORTS_READ),
  getBedOccupancy,
);
router.get(
  "/hospitals/:hospitalId/reports/daily-revenue",
  requireHospitalPermission(PERMISSIONS.REPORTS_READ),
  getDailyRevenue,
);
router.get(
  "/hospitals/:hospitalId/reports/low-stock",
  requireHospitalPermission(PERMISSIONS.REPORTS_READ),
  getLowStock,
);

export default router;
