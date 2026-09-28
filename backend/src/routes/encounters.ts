// Responsibility: Clinical encounter and prescription routes delegating to services
// backend/src/routes/encounters.ts

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { createPrescription } from "../services/prescriptions/PrescriptionService";
import {
  queryEncounters,
  createNewEncounter,
  updateExistingEncounter,
  queryPrescriptions,
} from "../services/encounters/EncounterService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = Router();

const getEncounters: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryEncounters(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.query.patient_id as string | undefined,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createEncounterRoute: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createNewEncounter(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const updateEncounterRoute: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingEncounter(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.encId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getPrescriptionsRoute: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryPrescriptions(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.encId!,
    );
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
  requireHospitalPermission(PERMISSIONS.ENCOUNTERS_READ),
  getEncounters,
);
router.post(
  "/hospitals/:hospitalId/encounters",
  requireHospitalPermission(PERMISSIONS.ENCOUNTERS_WRITE),
  createEncounterRoute,
);
router.patch(
  "/hospitals/:hospitalId/encounters/:encId",
  requireHospitalPermission(PERMISSIONS.ENCOUNTERS_WRITE),
  updateEncounterRoute,
);
router.get(
  "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  requireHospitalPermission(PERMISSIONS.PRESCRIPTIONS_READ),
  getPrescriptionsRoute,
);
router.post(
  "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  requireHospitalPermission(PERMISSIONS.PRESCRIPTIONS_WRITE),
  createPrescriptionRoute,
);

export default router;
