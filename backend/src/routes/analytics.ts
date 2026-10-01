// Responsibility: Analytics dashboard API routes for hospital insights

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData, sendError } from "../utils/respond";
import {
  getOverviewAnalytics,
  getAnalyticsByCategory,
} from "../services/analytics/AnalyticsService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = Router();

const getOverview: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { hospitalId } = authReq.params;
    const { startDate, endDate } = authReq.query as {
      startDate?: string;
      endDate?: string;
    };

    if (!startDate || !endDate) {
      return sendError(
        res,
        400,
        "MISSING_PARAMS",
        "startDate and endDate are required",
      );
    }

    const data = await getOverviewAnalytics(
      authReq.supabase,
      hospitalId!,
      startDate,
      endDate,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getAnalyticsByType: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { hospitalId, category } = authReq.params;
    const { startDate, endDate } = authReq.query as {
      startDate?: string;
      endDate?: string;
    };

    if (!startDate || !endDate) {
      return sendError(
        res,
        400,
        "MISSING_PARAMS",
        "startDate and endDate are required",
      );
    }

    const data = await getAnalyticsByCategory(
      authReq.supabase,
      hospitalId!,
      category!,
      startDate,
      endDate,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  "/hospitals/:hospitalId/analytics/overview",
  requireHospitalPermission(PERMISSIONS.ANALYTICS_READ),
  getOverview,
);

router.get(
  "/hospitals/:hospitalId/analytics/:category",
  requireHospitalPermission(PERMISSIONS.ANALYTICS_READ),
  getAnalyticsByType,
);

export default router;
