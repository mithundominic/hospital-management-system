// Responsibility: Staff shifts scheduling routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getShifts: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase
      .from("staff_shifts")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);
    if (authReq.query.date)
      query = query.eq("shift_date", authReq.query.date as string);
    if (authReq.query.membership_id)
      query = query.eq("membership_id", authReq.query.membership_id as string);
    const { data, error } = await query.order("shift_date", {
      ascending: true,
    });
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createShift: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      membership_id,
      department_id,
      shift_date,
      start_time,
      end_time,
      notes,
    } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("staff_shifts")
      .insert({
        hospital_id: authReq.params.hospitalId,
        membership_id,
        department_id,
        shift_date,
        start_time,
        end_time,
        notes,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateShift: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("staff_shifts")
      .update(authReq.body)
      .eq("id", authReq.params.shiftId)
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
  "/hospitals/:hospitalId/shifts",
  requireHospitalPermission(PERMISSIONS.SHIFTS_READ),
  getShifts,
);
router.post(
  "/hospitals/:hospitalId/shifts",
  requireHospitalPermission(PERMISSIONS.SHIFTS_WRITE),
  createShift,
);
router.patch(
  "/hospitals/:hospitalId/shifts/:shiftId",
  requireHospitalPermission(PERMISSIONS.SHIFTS_WRITE),
  updateShift,
);

export default router;
