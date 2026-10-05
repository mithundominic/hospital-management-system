// Responsibility: Platform-level tenant management API route definitions

import { Router } from "express";
import { requirePlatformPermission } from "../middleware/requirePlatformPermission";
import {
  createTenant,
  listTenants,
  getTenant,
  updateTenant,
  updateBranding,
} from "./tenant.handlers";
import {
  suspendTenant,
  reactivateTenant,
  archiveTenant,
} from "./tenantLifecycle.handlers";
import {
  getLifecycleEvents,
  uploadBAADocument,
  getBAADocuments,
  exportTenantData,
  cloneTenant,
} from "./tenantCompliance.handlers";

const router = Router();

router.post("/tenants", requirePlatformPermission("tenants.create"), createTenant);
router.get("/tenants", requirePlatformPermission("tenants.read"), listTenants);
router.get("/tenants/:hospitalId", requirePlatformPermission("tenants.read"), getTenant);
router.patch("/tenants/:hospitalId", requirePlatformPermission("tenants.update"), updateTenant);
router.post("/tenants/:hospitalId/suspend", requirePlatformPermission("tenants.suspend"), suspendTenant);
router.post("/tenants/:hospitalId/reactivate", requirePlatformPermission("tenants.suspend"), reactivateTenant);
router.post("/tenants/:hospitalId/archive", requirePlatformPermission("tenants.delete"), archiveTenant);
router.put("/tenants/:hospitalId/branding", requirePlatformPermission("tenants.update"), updateBranding);
router.get("/tenants/:hospitalId/lifecycle-events", requirePlatformPermission("tenants.read"), getLifecycleEvents);
router.post("/tenants/:hospitalId/baa-documents", requirePlatformPermission("tenants.update"), uploadBAADocument);
router.get("/tenants/:hospitalId/baa-documents", requirePlatformPermission("tenants.read"), getBAADocuments);
router.post("/tenants/:hospitalId/export", requirePlatformPermission("tenants.export"), exportTenantData);
router.post("/tenants/:hospitalId/clone", requirePlatformPermission("tenants.clone"), cloneTenant);

export default router;
