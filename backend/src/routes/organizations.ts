// Responsibility: Route definitions for enterprise organization and multi-facility operations

import { Router } from "express";
import { API_ROUTES } from "../constants/routes";
import { PERMISSIONS } from "../constants/permissions";
import { requireOrganizationPermission } from "../middleware/requireOrganizationPermission";
import {
  getUserOrganizations,
  getOrganization,
  updateOrganization,
  getMembers,
} from "./organization.handlers";
import {
  getFacilities,
  createFacility,
  searchPatients,
} from "./organizationFacilities.handlers";

const router = Router();

router.get(API_ROUTES.organizations.list, getUserOrganizations);

router.get(
  API_ROUTES.organizations.detail,
  requireOrganizationPermission(PERMISSIONS.ORG_READ),
  getOrganization,
);

router.patch(
  API_ROUTES.organizations.detail,
  requireOrganizationPermission(PERMISSIONS.ORG_WRITE),
  updateOrganization,
);

router.get(
  API_ROUTES.organizations.facilities,
  requireOrganizationPermission(PERMISSIONS.ORG_READ),
  getFacilities,
);

router.post(
  API_ROUTES.organizations.facilities,
  requireOrganizationPermission(PERMISSIONS.ORG_FACILITIES_CREATE),
  createFacility,
);

router.get(
  API_ROUTES.organizations.patientsSearch,
  requireOrganizationPermission(PERMISSIONS.PATIENTS_READ),
  searchPatients,
);

router.get(
  API_ROUTES.organizations.members,
  requireOrganizationPermission(PERMISSIONS.ORG_READ),
  getMembers,
);

export default router;
