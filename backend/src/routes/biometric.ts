// Responsibility: Biometric device and webhook route definitions

import express from "express";
import { requireHospitalPermission } from "../middleware/auth";
import { PERMISSIONS } from "../constants";
import {
  getDevices,
  getDevice,
  createDeviceHandler,
  updateDeviceHandler,
  updateDeviceStatusHandler,
  deleteDeviceHandler,
} from "./biometric.handlers";
import {
  getPinMappings,
  createPinMappingHandler,
  updatePinMappingHandler,
  deletePinMappingHandler,
} from "./biometric-pin.handlers";
import { webhookHandler } from "./biometric-webhook.handlers";

const router = express.Router();

// Device management routes
router.get(
  "/hospitals/:hospitalId/biometric/devices",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_READ),
  getDevices,
);

router.get(
  "/hospitals/:hospitalId/biometric/devices/:deviceId",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_READ),
  getDevice,
);

router.post(
  "/hospitals/:hospitalId/biometric/devices",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  createDeviceHandler,
);

router.patch(
  "/hospitals/:hospitalId/biometric/devices/:deviceId",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  updateDeviceHandler,
);

router.patch(
  "/hospitals/:hospitalId/biometric/devices/:deviceId/status",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  updateDeviceStatusHandler,
);

router.delete(
  "/hospitals/:hospitalId/biometric/devices/:deviceId",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  deleteDeviceHandler,
);

// Employee PIN mapping routes
router.get(
  "/hospitals/:hospitalId/biometric/pin-mappings",
  requireHospitalPermission(PERMISSIONS.ATTENDANCE_READ),
  getPinMappings,
);

router.post(
  "/hospitals/:hospitalId/biometric/pin-mappings",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  createPinMappingHandler,
);

router.patch(
  "/hospitals/:hospitalId/biometric/pin-mappings/:mappingId",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  updatePinMappingHandler,
);

router.delete(
  "/hospitals/:hospitalId/biometric/pin-mappings/:mappingId",
  requireHospitalPermission(PERMISSIONS.DEVICES_MANAGE),
  deletePinMappingHandler,
);

// Webhook endpoint - NO auth required (device callback)
// Follows Rule 9: Auth Exceptions pattern (see abdmCallbacks.js)
router.post("/biometric/webhook", webhookHandler);

export default router;
