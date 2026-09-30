// Responsibility: Patient portal self-service routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";
import {
  queryMyAppointments,
  createAppointmentRequest,
  queryMyLabResults,
} from "../services/patientPortal/PatientPortalService";
import { queryMyPrescriptions } from "../services/patientPortal/PrescriptionService";

const router = express.Router();

const getMyAppointments: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyAppointments(authReq.supabase, {
      status: authReq.query.status as string | undefined,
      from_date: authReq.query.from_date as string | undefined,
    });
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const requestAppointment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createAppointmentRequest(authReq.supabase, authReq.body);
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const getMyLabResults: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyLabResults(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getMyPrescriptions: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyPrescriptions(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  "/patient-portal/my-appointments",
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_READ_OWN),
  getMyAppointments,
);

router.post(
  "/patient-portal/appointment-requests",
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_REQUEST),
  requestAppointment,
);

router.get(
  "/patient-portal/my-lab-results",
  requireHospitalPermission(PERMISSIONS.LAB_READ_OWN),
  getMyLabResults,
);

router.get(
  "/patient-portal/my-prescriptions",
  requireHospitalPermission(PERMISSIONS.PRESCRIPTIONS_READ_OWN),
  getMyPrescriptions,
);

export default router;
