// Responsibility: Patient portal self-service routes

import express from "express";
import { requirePatientPermission } from "../middleware/requirePatientPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";
import { API_ROUTES } from "../constants/routes";
import {
  queryMyAppointments,
  createAppointmentRequest,
  queryMyPatientRegistrations,
} from "../services/patientPortal/PatientPortalService";
import { queryMyLabResults } from "../services/patientPortal/LabResultsService";
import { queryMyPrescriptions } from "../services/patientPortal/PrescriptionService";

const router = express.Router();

const getMyPatientRegistrations: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyPatientRegistrations(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

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
  API_ROUTES.patientPortal.registrations,
  requirePatientPermission(PERMISSIONS.APPOINTMENTS_READ_OWN),
  getMyPatientRegistrations,
);

router.get(
  API_ROUTES.patientPortal.myAppointments,
  requirePatientPermission(PERMISSIONS.APPOINTMENTS_READ_OWN),
  getMyAppointments,
);

router.post(
  API_ROUTES.patientPortal.appointmentRequests,
  requirePatientPermission(PERMISSIONS.APPOINTMENTS_REQUEST),
  requestAppointment,
);

router.get(
  API_ROUTES.patientPortal.myLabResults,
  requirePatientPermission(PERMISSIONS.LAB_READ_OWN),
  getMyLabResults,
);

router.get(
  API_ROUTES.patientPortal.myPrescriptions,
  requirePatientPermission(PERMISSIONS.PRESCRIPTIONS_READ_OWN),
  getMyPrescriptions,
);

export default router;
