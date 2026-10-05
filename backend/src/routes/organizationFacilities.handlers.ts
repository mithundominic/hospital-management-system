// Responsibility: Route handlers for organization facilities and EMPI patient lookup

import { RouteHandler, AuthenticatedRequest } from "../types";
import { sendData, sendError } from "../utils/respond";
import {
  OrganizationService,
  OrganizationFacilityService,
  OrganizationEmpiService,
} from "../services/organization";

const orgService = new OrganizationService();
const facilityService = new OrganizationFacilityService();
const empiService = new OrganizationEmpiService();

export const getFacilities: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const facilities = await facilityService.getFacilities(
      authReq.params.orgId!,
      authReq.supabase,
    );
    sendData(res, facilities);
  } catch (err) {
    next(err);
  }
};

export const createFacility: RouteHandler = async (req, res, _next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const org = await orgService.getOrganization(
      authReq.params.orgId!,
      authReq.supabase,
    );
    const facility = await facilityService.createFacility(
      authReq.params.orgId!,
      authReq.body,
      org,
      authReq.supabase,
    );
    sendData(res, facility, 201);
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    if (errorObj?.code === "QUOTA_EXCEEDED") {
      sendError(res, 403, "QUOTA_EXCEEDED", errorObj.message || "Quota exceeded");
      return;
    }
    sendError(res, 400, "BAD_REQUEST", errorObj?.message || "Bad request");
  }
};

export const searchPatients: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const query = String(authReq.query.q || "");
    const results = await empiService.searchPatients(
      authReq.params.orgId!,
      query,
      authReq.supabase,
    );
    sendData(res, results);
  } catch (err) {
    next(err);
  }
};
