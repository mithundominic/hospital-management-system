// Responsibility: Route handlers for organization profile and member operations

import { RouteHandler, AuthenticatedRequest } from "../types";
import { sendData } from "../utils/respond";
import {
  OrganizationService,
  OrganizationEmpiService,
} from "../services/organization";

const orgService = new OrganizationService();
const empiService = new OrganizationEmpiService();

export const getUserOrganizations: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const orgs = await orgService.getUserOrganizations(
      authReq.userId,
      authReq.supabase,
    );
    sendData(res, orgs);
  } catch (err) {
    next(err);
  }
};

export const getOrganization: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const org = await orgService.getOrganization(
      authReq.params.orgId!,
      authReq.supabase,
    );
    sendData(res, org);
  } catch (err) {
    next(err);
  }
};

export const updateOrganization: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const updated = await orgService.updateOrganization(
      authReq.params.orgId!,
      authReq.body,
      authReq.supabase,
    );
    sendData(res, updated);
  } catch (err) {
    next(err);
  }
};

export const getMembers: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const members = await empiService.getMembers(
      authReq.params.orgId!,
      authReq.supabase,
    );
    sendData(res, members);
  } catch (err) {
    next(err);
  }
};
