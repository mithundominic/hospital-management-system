// Responsibility: Organization-scoped permission enforcement middleware

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/respond";
import { AuthenticatedRequest } from "../types";

interface OrgPermissionOptions {
  orgIdParam?: string;
}

export const requireOrganizationPermission = (
  permission: string,
  options: OrgPermissionOptions = {},
) => {
  const { orgIdParam = "orgId" } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const orgId = authReq.params[orgIdParam];

    if (!orgId) {
      sendError(res, 400, "BAD_REQUEST", `Missing :${orgIdParam} in route`);
      return;
    }

    try {
      const { data: hasPerm, error } = await authReq.supabase.rpc(
        "has_org_permission",
        {
          p_org_id: orgId,
          p_user_id: authReq.userId,
          p_permission: permission,
        },
      );

      if (error) {
        throw new Error(`Organization authorization check failed: ${error.message}`);
      }

      if (!hasPerm) {
        sendError(
          res,
          403,
          "FORBIDDEN",
          `Missing required permission: ${permission}`,
        );
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
