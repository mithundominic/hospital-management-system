// backend/src/routes/hospitals.ts
// Responsibility: Hospital management API routes

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { sendData, sendError } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = Router();

const getHospitals: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("hospitals")
      .select("*, memberships!inner(user_id, status)")
      .eq("memberships.user_id", authReq.userId)
      .eq("memberships.status", "active");
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("hospitals")
      .select("*")
      .eq("id", authReq.params.hospitalId)
      .single();
    if (error) {
      sendError(
        res,
        404,
        "NOT_FOUND",
        "Hospital not found or not visible to you",
      );
      return;
    }
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const updateHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("hospitals")
      .update(authReq.body)
      .eq("id", authReq.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get("/hospitals", getHospitals);
router.get("/hospitals/:hospitalId", getHospital);
router.patch(
  "/hospitals/:hospitalId",
  requireHospitalPermission("hospital.manage"),
  updateHospital,
);

export default router;
