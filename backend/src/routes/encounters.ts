// Responsibility: Clinical encounter and prescription routes delegating to services

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import {
  getEncounters,
  createEncounterRoute,
  updateEncounterRoute,
  getPrescriptionsRoute,
  createPrescriptionRoute,
} from "./encounters.handlers";

const router = Router();

router.get(
  API_ROUTES.encounters.list,
  requireHospitalPermission(PERMISSIONS.ENCOUNTERS_READ),
  getEncounters,
);
router.post(
  API_ROUTES.encounters.list,
  requireHospitalPermission(PERMISSIONS.ENCOUNTERS_WRITE),
  createEncounterRoute,
);
router.patch(
  API_ROUTES.encounters.detail,
  requireHospitalPermission(PERMISSIONS.ENCOUNTERS_WRITE),
  updateEncounterRoute,
);
router.get(
  API_ROUTES.encounters.prescriptions,
  requireHospitalPermission(PERMISSIONS.PRESCRIPTIONS_READ),
  getPrescriptionsRoute,
);
router.post(
  API_ROUTES.encounters.prescriptions,
  requireHospitalPermission(PERMISSIONS.PRESCRIPTIONS_WRITE),
  createPrescriptionRoute,
);

export default router;
