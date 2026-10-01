// Responsibility: Hospital reports routes (bed occupancy, revenue, low stock)

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryBedOccupancySummary,
  queryDailyRevenueSummary,
  queryLowStockAlerts,
} from "../services/reports/ReportsService";
import { AuthenticatedRequest, RouteHandler } from "../types";
import { reportsRateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.use(reportsRateLimiter);

const getBedOccupancy: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryBedOccupancySummary(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getDailyRevenue: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryDailyRevenueSummary(
      authReq.supabase,
      authReq.params.hospitalId!,
      {
        from: authReq.query.from as string | undefined,
        to: authReq.query.to as string | undefined,
      },
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getLowStock: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryLowStockAlerts(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  API_ROUTES.reports.bedOccupancy,
  requireHospitalPermission(PERMISSIONS.REPORTS_READ),
  getBedOccupancy,
);
router.get(
  API_ROUTES.reports.dailyRevenue,
  requireHospitalPermission(PERMISSIONS.REPORTS_READ),
  getDailyRevenue,
);
router.get(
  API_ROUTES.reports.lowStock,
  requireHospitalPermission(PERMISSIONS.REPORTS_READ),
  getLowStock,
);

export default router;
