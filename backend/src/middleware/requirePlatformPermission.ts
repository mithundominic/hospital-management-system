// Responsibility: Platform-level permission enforcement for SuperAdmin/Support

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/respond";
import { AuthenticatedRequest } from "../types";

export const requirePlatformPermission = (permission: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    try {
      const { data: hasPerm, error } = await authReq.supabase.rpc(
        "has_platform_permission",
        { user_id: authReq.userId, permission_key: permission },
      );

      if (error) throw error;

      if (!hasPerm) {
        sendError(
          res,
          403,
          "FORBIDDEN",
          "You do not have platform-level permission for this action",
        );
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
