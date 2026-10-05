// Responsibility: HTTP request handlers for tenant lifecycle transitions

import { sendData, sendError } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";
import * as TenantService from "../services/platform/TenantManagementService";

export const suspendTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { reason } = authReq.body;

    if (!reason) {
      sendError(res, 400, "BAD_REQUEST", "Suspension reason is required");
      return;
    }

    const data = await TenantService.suspendTenant(
      authReq.supabase,
      authReq.params.hospitalId!,
      reason,
      authReq.userId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const reactivateTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.reactivateTenant(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.userId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const archiveTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.archiveTenant(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.userId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
