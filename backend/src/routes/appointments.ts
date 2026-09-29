// Responsibility: Appointments booking and scheduling routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryAppointments,
  createNewAppointment,
  updateExistingAppointment,
} from "../services/appointments/AppointmentService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getAppointments: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryAppointments(
      authReq.supabase,
      authReq.params.hospitalId!,
      {
        doctor_membership_id: authReq.query.doctor_membership_id as
          string | undefined,
        patient_id: authReq.query.patient_id as string | undefined,
        date: authReq.query.date as string | undefined,
      },
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createAppointment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createNewAppointment(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateAppointment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingAppointment(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.apptId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get(
  API_ROUTES.appointments.list,
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_READ),
  getAppointments,
);
router.post(
  API_ROUTES.appointments.list,
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_WRITE),
  createAppointment,
);
router.patch(
  API_ROUTES.appointments.detail,
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_WRITE),
  updateAppointment,
);

export default router;
