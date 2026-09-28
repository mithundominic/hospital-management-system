// Responsibility: Insurance policies and claims routes
// Policies nested under /patients (patient-owned), claims under /hospitals
// IMPORTANT: Policy routes bypass requireHospitalPermission - RLS enforces access

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import {
  getPolicies,
  createPolicy,
} from "../services/insurance/PoliciesService";
import {
  getClaims,
  createClaim,
  updateClaim,
} from "../services/insurance/ClaimsService";

const router = express.Router();

// Patient-owned insurance policies - RLS enforces access
router.get("/patients/:patientId/insurance-policies", getPolicies);
router.post("/patients/:patientId/insurance-policies", createPolicy);

// Hospital-scoped insurance claims
router.get(
  "/hospitals/:hospitalId/insurance-claims",
  requireHospitalPermission(PERMISSIONS.INSURANCE_CLAIMS_READ),
  getClaims,
);
router.post(
  "/hospitals/:hospitalId/insurance-claims",
  requireHospitalPermission(PERMISSIONS.INSURANCE_CLAIMS_WRITE),
  createClaim,
);
router.patch(
  "/hospitals/:hospitalId/insurance-claims/:claimId",
  requireHospitalPermission(PERMISSIONS.INSURANCE_CLAIMS_WRITE),
  updateClaim,
);

export default router;
