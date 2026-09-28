// Responsibility: IPD beds and admissions routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { getBeds, createBed, updateBed } from "../services/ipd/BedsService";
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
} from "../services/ipd/AdmissionsService";

const router = express.Router();

router.get(
  "/hospitals/:hospitalId/beds",
  requireHospitalPermission(PERMISSIONS.BEDS_READ),
  getBeds,
);
router.post(
  "/hospitals/:hospitalId/beds",
  requireHospitalPermission(PERMISSIONS.BEDS_WRITE),
  createBed,
);
router.patch(
  "/hospitals/:hospitalId/beds/:bedId",
  requireHospitalPermission(PERMISSIONS.BEDS_WRITE),
  updateBed,
);

router.get(
  "/hospitals/:hospitalId/admissions",
  requireHospitalPermission(PERMISSIONS.ADMISSIONS_READ),
  getAdmissions,
);
router.post(
  "/hospitals/:hospitalId/admissions",
  requireHospitalPermission(PERMISSIONS.ADMISSIONS_WRITE),
  createAdmission,
);
router.patch(
  "/hospitals/:hospitalId/admissions/:admId",
  requireHospitalPermission(PERMISSIONS.ADMISSIONS_WRITE),
  updateAdmission,
);

export default router;
