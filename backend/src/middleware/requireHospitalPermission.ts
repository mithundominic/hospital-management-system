// Responsibility: Hospital-scoped permission enforcement
// backend/src/middleware/requireHospitalPermission.ts
// Rule 6 Compliance: Every hospital-scoped route must use this middleware

import { Request, Response, NextFunction } from "express";
import { AuthorizationService } from "../services/AuthorizationService";
import { sendError } from "../utils/respond";
import config from "../config/env";
import { AuthenticatedRequest, PermissionMiddleware } from "../types";

const authService = new AuthorizationService(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);

interface PermissionOptions {
  hospitalIdParam?: string;
}

/**
 * Create middleware that requires a specific hospital permission
 * @param permission - Permission key (e.g., 'patients.read')
 * @param options - Configuration options
 * @returns Middleware function
 */
export const requireHospitalPermission: PermissionMiddleware = (
  permission: string,
  options: PermissionOptions = {},
) => {
  const { hospitalIdParam = "hospitalId" } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const hospitalId = authReq.params[hospitalIdParam];

    if (!hospitalId) {
      sendError(
        res,
        400,
        "BAD_REQUEST",
        `Missing :${hospitalIdParam} in route`,
      );
      return;
    }

    try {
      await authService.assert(authReq.userId, hospitalId, permission);
      next();
    } catch (err) {
      const error = err as Error & { code?: string };
      if (error.code === "FORBIDDEN") {
        sendError(res, 403, "FORBIDDEN", error.message);
        return;
      }
      next(err);
    }
  };
};
