// Responsibility: Staff-facing ABDM operations with proper auth

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import {
  getLinkRequests,
  initiateVerification,
  confirmVerification,
  linkCareContext,
  requestConsent,
} from "./abdm.handlers";

const router = Router();

router.get(
  API_ROUTES.abdm.linkRequests,
  requireHospitalPermission(PERMISSIONS.ABDM_READ),
  getLinkRequests,
);

router.post(
  API_ROUTES.abdm.verify,
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  initiateVerification,
);

router.post(
  API_ROUTES.abdm.confirm,
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  confirmVerification,
);

router.post(
  API_ROUTES.abdm.linkCareContext,
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  linkCareContext,
);

router.post(
  API_ROUTES.abdm.consentRequests,
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  requestConsent,
);

export default router;
