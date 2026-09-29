// Responsibility: IPD beds and admissions routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { getBeds, createBed, updateBed } from "../services/ipd/BedsService";
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
} from "../services/ipd/AdmissionsService";

const router = express.Router();

router.get(
  API_ROUTES.ipd.beds,
  requireHospitalPermission(PERMISSIONS.BEDS_READ),
  getBeds,
);
router.post(
  API_ROUTES.ipd.beds,
  requireHospitalPermission(PERMISSIONS.BEDS_WRITE),
  createBed,
);
router.patch(
  API_ROUTES.ipd.bedDetail,
  requireHospitalPermission(PERMISSIONS.BEDS_WRITE),
  updateBed,
);

router.get(
  API_ROUTES.ipd.admissions,
  requireHospitalPermission(PERMISSIONS.ADMISSIONS_READ),
  getAdmissions,
);
router.post(
  API_ROUTES.ipd.admissions,
  requireHospitalPermission(PERMISSIONS.ADMISSIONS_WRITE),
  createAdmission,
);
router.patch(
  API_ROUTES.ipd.admissionDetail,
  requireHospitalPermission(PERMISSIONS.ADMISSIONS_WRITE),
  updateAdmission,
);

export default router;
