// Responsibility: Patient-scoped permission enforcement (hospital-agnostic)

import { Request, Response, NextFunction } from "express";
import { AuthorizationService } from "../services/AuthorizationService";
import { sendError } from "../utils/respond";
import config from "../config/env";
import { AuthenticatedRequest } from "../types";

const authService = new AuthorizationService(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);

/**
 * Create middleware that requires a patient-scoped permission
 * Unlike requireHospitalPermission, this checks if the user has the permission
 * in ANY hospital where they have Patient role (hospital-agnostic)
 * 
 * Use for patient portal routes where patients see data across all their registrations
 */
export const requirePatientPermission = (permission: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    try {
      // Query user's memberships to find any hospital with Patient role + this permission
      const { data, error } = await authService["supabase"]
        .from("memberships")
        .select(`
          hospital_id,
          role:roles!inner(name, role_permissions!inner(permission:permissions!inner(key)))
        `)
        .eq("user_id", authReq.userId)
        .eq("role.name", "Patient")
        .eq("role.role_permissions.permission.key", permission)
        .limit(1)
        .single();

      if (error || !data) {
        sendError(
          res,
          403,
          "FORBIDDEN",
          `Missing permission: ${permission}`,
        );
        return;
      }

      // Permission found - user has Patient role with this permission in at least one hospital
      next();
    } catch (err) {
      next(err);
    }
  };
};
