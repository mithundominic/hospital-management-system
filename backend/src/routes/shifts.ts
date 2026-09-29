// Responsibility: Staff shifts scheduling routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryStaffShifts,
  createNewStaffShift,
  updateExistingStaffShift,
} from "../services/staff/StaffShiftService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getShifts: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryStaffShifts(
      authReq.supabase,
      authReq.params.hospitalId!,
      {
        date: authReq.query.date as string | undefined,
        membership_id: authReq.query.membership_id as string | undefined,
      },
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createShift: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createNewStaffShift(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateShift: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingStaffShift(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.shiftId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  API_ROUTES.shifts.list,
  requireHospitalPermission(PERMISSIONS.SHIFTS_READ),
  getShifts,
);
router.post(
  API_ROUTES.shifts.list,
  requireHospitalPermission(PERMISSIONS.SHIFTS_WRITE),
  createShift,
);
router.patch(
  API_ROUTES.shifts.detail,
  requireHospitalPermission(PERMISSIONS.SHIFTS_WRITE),
  updateShift,
);

export default router;
