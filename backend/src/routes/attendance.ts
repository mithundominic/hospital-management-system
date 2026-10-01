// Responsibility: Staff attendance and leave management route definitions

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import {
  getAttendanceRecords,
  getMyAttendanceRecords,
  checkInHandler,
  checkOutHandler,
} from "./attendance.handlers";
import {
  getLeaveApplications,
  createLeave,
  approveLeaveHandler,
  rejectLeaveHandler,
} from "./leave.handlers";

const router = express.Router();

router.get(
  "/hospitals/:hospitalId/attendance",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_READ),
  getAttendanceRecords,
);

router.get(
  "/hospitals/:hospitalId/attendance/my-records",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_WRITE),
  getMyAttendanceRecords,
);

router.post(
  "/hospitals/:hospitalId/attendance/check-in",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_WRITE),
  checkInHandler,
);

router.post(
  "/hospitals/:hospitalId/attendance/check-out",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_WRITE),
  checkOutHandler,
);

router.get(
  "/hospitals/:hospitalId/leave-applications",
  requireHospitalPermission(PERMISSIONS.LEAVE_READ),
  getLeaveApplications,
);

router.post(
  "/hospitals/:hospitalId/leave-applications",
  requireHospitalPermission(PERMISSIONS.LEAVE_WRITE),
  createLeave,
);

router.patch(
  "/hospitals/:hospitalId/leave-applications/:leaveId/approve",
  requireHospitalPermission(PERMISSIONS.LEAVE_WRITE),
  approveLeaveHandler,
);

router.patch(
  "/hospitals/:hospitalId/leave-applications/:leaveId/reject",
  requireHospitalPermission(PERMISSIONS.LEAVE_WRITE),
  rejectLeaveHandler,
);

export default router;
