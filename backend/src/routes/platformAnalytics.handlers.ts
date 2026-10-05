// Responsibility: HTTP request handlers for platform analytics and reporting

import { sendData } from "../utils/respond";
import {
  getRevenueTimeSeries,
  getHospitalComparison,
  getStaffDistribution,
} from "../services/platform/PlatformAnalyticsService";
import { AuthenticatedRequest, RouteHandler } from "../types";

export const getRevenueTimeSeriesData: RouteHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { start, end, groupBy } = authReq.query;
    const data = await getRevenueTimeSeries(
      authReq.supabase,
      start as string,
      end as string,
      groupBy as "day" | "week" | "month",
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getHospitalComparisonData: RouteHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await getHospitalComparison(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getStaffDistributionData: RouteHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await getStaffDistribution(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
