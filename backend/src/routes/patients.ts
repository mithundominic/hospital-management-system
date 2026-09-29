// Responsibility: Patient management API routes

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
} from "./patients.handlers";

const router = Router();

router.get(
  API_ROUTES.patients.list,
  requireHospitalPermission(PERMISSIONS.PATIENTS_READ),
  getPatients,
);
router.get(
  API_ROUTES.patients.detail,
  requireHospitalPermission(PERMISSIONS.PATIENTS_READ),
  getPatient,
);
router.post(
  API_ROUTES.patients.list,
  requireHospitalPermission(PERMISSIONS.PATIENTS_WRITE),
  createPatient,
);
router.patch(
  API_ROUTES.patients.detail,
  requireHospitalPermission(PERMISSIONS.PATIENTS_WRITE),
  updatePatient,
);

export default router;
