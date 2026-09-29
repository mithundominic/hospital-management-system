// Responsibility: Doctor profiles and departments routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
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
  API_ROUTES.staff.doctors,
  requireHospitalPermission(PERMISSIONS.DOCTORS_READ),
  getDoctors,
);
router.post(
  API_ROUTES.staff.doctors,
  requireHospitalPermission(PERMISSIONS.DOCTORS_WRITE),
  createDoctor,
);
router.patch(
  API_ROUTES.staff.doctorDetail,
  requireHospitalPermission(PERMISSIONS.DOCTORS_WRITE),
  updateDoctor,
);

router.get(
  API_ROUTES.staff.departments,
  requireHospitalPermission(PERMISSIONS.DEPARTMENTS_READ),
  getDepartments,
);
router.post(
  API_ROUTES.staff.departments,
  requireHospitalPermission(PERMISSIONS.DEPARTMENTS_WRITE),
  createDepartment,
);

export default router;
