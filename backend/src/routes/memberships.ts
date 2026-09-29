// Responsibility: Staff memberships and role management routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryHospitalMemberships,
  createNewMembership,
  updateExistingMembership,
} from "../services/staff/MembershipsService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getMemberships: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryHospitalMemberships(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createMembership: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createNewMembership(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateMembership: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingMembership(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.membershipId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  API_ROUTES.memberships.list,
  requireHospitalPermission(PERMISSIONS.MEMBERSHIPS_MANAGE),
  getMemberships,
);
router.post(
  API_ROUTES.memberships.list,
  requireHospitalPermission(PERMISSIONS.MEMBERSHIPS_MANAGE),
  createMembership,
);
router.patch(
  API_ROUTES.memberships.detail,
  requireHospitalPermission(PERMISSIONS.MEMBERSHIPS_MANAGE),
  updateMembership,
);

export default router;
