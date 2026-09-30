// Responsibility: Hospital management API routes

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData, sendError } from "../utils/respond";
import {
  queryUserHospitals,
  queryHospitalById,
  updateHospitalDetails,
  createHospitalTenant,
} from "../services/hospitals/HospitalService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = Router();

const getHospitals: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryUserHospitals(authReq.supabase, authReq.userId!);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    try {
      const data = await queryHospitalById(
        authReq.supabase,
        authReq.params.hospitalId!,
      );
      sendData(res, data);
    } catch (_error) {
      sendError(
        res,
        404,
        "NOT_FOUND",
        "Hospital not found or not visible to you",
      );
    }
  } catch (err) {
    next(err);
  }
};

const updateHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateHospitalDetails(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createHospital: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.body?.name) {
      sendError(res, 400, "BAD_REQUEST", "Hospital name is required");
      return;
    }
    const data = await createHospitalTenant(authReq.supabase, authReq.body);
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

router.get(API_ROUTES.hospitals.list, getHospitals);
router.post(API_ROUTES.hospitals.list, createHospital);
router.get(API_ROUTES.hospitals.detail, getHospital);
router.patch(
  API_ROUTES.hospitals.detail,
  requireHospitalPermission(PERMISSIONS.HOSPITAL_MANAGE),
  updateHospital,
);

export default router;
