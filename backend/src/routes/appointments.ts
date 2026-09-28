// Responsibility: Appointments booking and scheduling routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getAppointments: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase
      .from("appointments")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);

    if (authReq.query.doctor_membership_id) {
      query = query.eq("doctor_membership_id", authReq.query.doctor_membership_id as string);
    }
    if (authReq.query.patient_id) {
      query = query.eq("patient_id", authReq.query.patient_id as string);
    }
    if (authReq.query.date) {
      const date = authReq.query.date as string;
      query = query.gte("scheduled_at", `${date}T00:00:00`).lte("scheduled_at", `${date}T23:59:59`);
    }

    const { data, error } = await query.order("scheduled_at", { ascending: true });
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createAppointment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { patient_id, doctor_membership_id, department_id, scheduled_at, notes } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("appointments")
      .insert({
        hospital_id: authReq.params.hospitalId,
        patient_id, doctor_membership_id, department_id, scheduled_at, notes,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateAppointment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("appointments")
      .update(authReq.body)
      .eq("id", authReq.params.apptId)
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
  "/hospitals/:hospitalId/appointments",
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_READ),
  getAppointments,
);
router.post(
  "/hospitals/:hospitalId/appointments",
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_WRITE),
  createAppointment,
);
router.patch(
  "/hospitals/:hospitalId/appointments/:apptId",
  requireHospitalPermission(PERMISSIONS.APPOINTMENTS_WRITE),
  updateAppointment,
);

export default router;
