// Responsibility: Patient portal self-service routes

import express from "express";
import { requirePatientPermission } from "../middleware/requirePatientPermission";
import { PERMISSIONS } from "../constants";
import { API_ROUTES } from "../constants/routes";
import {
  getMyPatientRegistrations,
  getMyAppointments,
  requestAppointment,
  getMyLabResults,
  getMyPrescriptions,
  checkHasPatientRole,
} from "./patientPortal.handlers";

const router = express.Router();

router.get("/patient-portal/has-patient-role", checkHasPatientRole);

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
