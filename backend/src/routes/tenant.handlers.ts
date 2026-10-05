// Responsibility: HTTP request handler functions for tenant settings & queries

import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";
import * as TenantService from "../services/platform/TenantManagementService";

export const createTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.createTenant(
      authReq.supabase,
      authReq.body,
      authReq.userId,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const listTenants: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.getAllTenants(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.getTenantById(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const updateTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.updateTenantSettings(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const updateBranding: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.updateBranding(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
