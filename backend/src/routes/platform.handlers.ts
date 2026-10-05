// Responsibility: HTTP request handler functions for platform admin routes

import { sendData } from "../utils/respond";
import {
  queryAllHospitals,
  queryHospitalStats,
  toggleHospitalStatus,
  checkIsPlatformAdmin,
} from "../services/platform/PlatformHospitalService";
import { getPlatformAnalytics } from "../services/platform/PlatformAnalyticsService";
import { AuthenticatedRequest, RouteHandler } from "../types";

export const getAllHospitals: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryAllHospitals(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getHospitalStats: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const stats = await queryHospitalStats(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, stats);
  } catch (err) {
    next(err);
  }
};

export const getAnalytics: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await getPlatformAnalytics(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const activateHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await toggleHospitalStatus(
      authReq.supabase,
      authReq.params.hospitalId!,
      true,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const deactivateHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await toggleHospitalStatus(
      authReq.supabase,
      authReq.params.hospitalId!,
      false,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getPlatformStatus: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const isPlatformAdmin = await checkIsPlatformAdmin(
      authReq.supabase,
      authReq.userId,
    );
    sendData(res, { isPlatformAdmin });
  } catch (err) {
    next(err);
  }
};
