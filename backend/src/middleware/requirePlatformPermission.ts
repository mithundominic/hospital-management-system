// Responsibility: Platform-level permission authorization middleware

import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../types";
import { sendError } from "../utils/respond";

/**
 * Middleware to check if user has platform-level permission
 * Used for SuperAdmin/Support routes that need cross-hospital access
 */
export function requirePlatformPermission(permission: string): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { data, error } = await authReq.supabase.rpc(
        "has_platform_permission",
        {
          p_user_id: authReq.userId,
          p_permission: permission,
        },
      );

      if (error) {
        console.error("Platform permission check failed:", error);
        sendError(res, 500, "INTERNAL_ERROR", "Permission check failed");
        return;
      }

      if (!data) {
        sendError(
          res,
          403,
          "FORBIDDEN",
          `Platform permission required: ${permission}`,
        );
        return;
      }

      next();
    } catch (err) {
      console.error("Platform permission middleware error:", err);
      sendError(res, 500, "INTERNAL_ERROR", "Authorization error");
    }
  };
}
