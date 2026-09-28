// backend/src/routes/encounters.ts
// Responsibility: Encounter and prescription API routes

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { sendData } from "../utils/respond";
import { createPrescription } from "../services/prescriptions/PrescriptionService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = Router();

const getEncounters: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase
      .from("encounters")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);

    if (authReq.query.patient_id) {
      query = query.eq("patient_id", authReq.query.patient_id);
    }

    const { data, error } = await query.order("started_at", {
      ascending: false,
    });
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createEncounter: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      patient_id,
      appointment_id,
      doctor_membership_id,
      department_id,
      encounter_type,
      chief_complaint,
      vitals,
    } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("encounters")
      .insert({
        hospital_id: authReq.params.hospitalId,
        patient_id,
        appointment_id,
        doctor_membership_id,
        department_id,
        encounter_type,
        chief_complaint,
        vitals,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateEncounter: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("encounters")
      .update(authReq.body)
      .eq("id", authReq.params.encId)
      .eq("hospital_id", authReq.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getPrescriptions: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("prescriptions")
      .select("*, prescription_items(*)")
      .eq("encounter_id", authReq.params.encId)
      .eq("hospital_id", authReq.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createPrescriptionRoute: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const prescription = await createPrescription(authReq.supabase, {
      hospital_id: authReq.params.hospitalId!,
      encounter_id: authReq.params.encId!,
      prescribed_by: authReq.body.prescribed_by,
      notes: authReq.body.notes,
      items: authReq.body.items || [],
    });
    sendData(res, prescription, 201);
  } catch (err) {
    next(err);
  }
};

router.get(
  "/hospitals/:hospitalId/encounters",
  requireHospitalPermission("encounters.read"),
  getEncounters,
);
router.post(
  "/hospitals/:hospitalId/encounters",
  requireHospitalPermission("encounters.write"),
  createEncounter,
);
router.patch(
  "/hospitals/:hospitalId/encounters/:encId",
  requireHospitalPermission("encounters.write"),
  updateEncounter,
);
router.get(
  "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  requireHospitalPermission("prescriptions.read"),
  getPrescriptions,
);
router.post(
  "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  requireHospitalPermission("prescriptions.write"),
  createPrescriptionRoute,
);

export default router;
