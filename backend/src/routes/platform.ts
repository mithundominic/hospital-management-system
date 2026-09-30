// Responsibility: Platform admin API route registration
 
import { Router } from "express";
import { requirePlatformPermission } from "../middleware/requirePlatformPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import {
  getAllHospitals,
  getHospitalStats,
  getAnalytics,
  activateHospital,
  deactivateHospital,
} from "./platform.handlers";

const router = Router();

router.get(
  API_ROUTES.platform.hospitals,
  requirePlatformPermission(PERMISSIONS.PLATFORM_MANAGE_HOSPITALS),
  getAllHospitals,
);

router.get(
  API_ROUTES.platform.analytics,
  requirePlatformPermission(PERMISSIONS.PLATFORM_SUPPORT_ACCESS),
  getAnalytics,
);

router.get(
  API_ROUTES.platform.hospitalStats,
  requirePlatformPermission(PERMISSIONS.PLATFORM_SUPPORT_ACCESS),
  getHospitalStats,
);

router.patch(
  API_ROUTES.platform.activateHospital,
  requirePlatformPermission(PERMISSIONS.PLATFORM_MANAGE_HOSPITALS),
  activateHospital,
);

router.patch(
  API_ROUTES.platform.deactivateHospital,
  requirePlatformPermission(PERMISSIONS.PLATFORM_MANAGE_HOSPITALS),
  deactivateHospital,
);

export default router;
