// Responsibility: HTTP handlers for tenant BAA compliance, export, lifecycle events, and cloning

import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";
import * as TenantService from "../services/platform/TenantManagementService";
import * as TenantExportService from "../services/platform/TenantExportService";
import * as TenantCloneService from "../services/platform/TenantCloneService";

export const getLifecycleEvents: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.getLifecycleEvents(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const uploadBAADocument: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { document_url, signed_at, expires_at } = authReq.body;
    const data = await TenantService.uploadBAADocument(
      authReq.supabase,
      authReq.params.hospitalId!,
      document_url,
      signed_at,
      expires_at,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getBAADocuments: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantService.getBAADocuments(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const exportTenantData: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const format = (authReq.query.format as "json" | "csv") || "json";
    const data = await TenantExportService.exportTenantData(
      authReq.supabase,
      authReq.params.hospitalId!,
      format,
    );

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="tenant-${authReq.params.hospitalId}-export.csv"`,
      );
      res.send(data);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="tenant-${authReq.params.hospitalId}-export.json"`,
      );
      sendData(res, data);
    }
  } catch (err) {
    next(err);
  }
};

export const cloneTenant: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await TenantCloneService.cloneTenant(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
      authReq.userId,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
