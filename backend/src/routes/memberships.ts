// Responsibility: Staff memberships and role management routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getMemberships: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("memberships")
      .select("*, roles(name)")
      .eq("hospital_id", authReq.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createMembership: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { user_id, role_id } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("memberships")
      .insert({
        user_id,
        role_id,
        hospital_id: authReq.params.hospitalId,
        status: "invited",
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateMembership: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { role_id, status } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("memberships")
      .update({ ...(role_id && { role_id }), ...(status && { status }) })
      .eq("id", authReq.params.membershipId)
      .eq("hospital_id", authReq.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  "/hospitals/:hospitalId/memberships",
  requireHospitalPermission(PERMISSIONS.MEMBERSHIPS_MANAGE),
  getMemberships,
);
router.post(
  "/hospitals/:hospitalId/memberships",
  requireHospitalPermission(PERMISSIONS.MEMBERSHIPS_MANAGE),
  createMembership,
);
router.patch(
  "/hospitals/:hospitalId/memberships/:membershipId",
  requireHospitalPermission(PERMISSIONS.MEMBERSHIPS_MANAGE),
  updateMembership,
);

export default router;
