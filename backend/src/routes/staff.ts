// Responsibility: Doctor profiles and departments routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
} from "../services/staff/DoctorsService";
import {
  getDepartments,
  createDepartment,
} from "../services/staff/DepartmentsService";

const router = express.Router();

router.get(
  "/hospitals/:hospitalId/doctors",
  requireHospitalPermission(PERMISSIONS.DOCTORS_READ),
  getDoctors,
);
router.post(
  "/hospitals/:hospitalId/doctors",
  requireHospitalPermission(PERMISSIONS.DOCTORS_WRITE),
  createDoctor,
);
router.patch(
  "/hospitals/:hospitalId/doctors/:doctorId",
  requireHospitalPermission(PERMISSIONS.DOCTORS_WRITE),
  updateDoctor,
);

router.get(
  "/hospitals/:hospitalId/departments",
  requireHospitalPermission(PERMISSIONS.DEPARTMENTS_READ),
  getDepartments,
);
router.post(
  "/hospitals/:hospitalId/departments",
  requireHospitalPermission(PERMISSIONS.DEPARTMENTS_WRITE),
  createDepartment,
);

export default router;
