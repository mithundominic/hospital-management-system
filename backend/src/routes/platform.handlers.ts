// Responsibility: HTTP request handler functions for platform admin routes
 
import { sendData } from "../utils/respond";
import {
  queryAllHospitals,
  queryHospitalStats,
  toggleHospitalStatus,
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
    const { data, error } = await authReq.supabase.rpc("is_platform_admin", {
      p_user_id: authReq.userId,
    });
    if (error) {
      sendData(res, { isPlatformAdmin: false });
      return;
    }
    sendData(res, { isPlatformAdmin: Boolean(data) });
  } catch (err) {
    next(err);
  }
};

