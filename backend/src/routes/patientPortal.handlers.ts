// Responsibility: Patient portal route handlers

import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";
import {
  queryMyAppointments,
  createAppointmentRequest,
  queryMyPatientRegistrations,
  checkPatientRole,
} from "../services/patientPortal/PatientPortalService";
import { queryMyLabResults } from "../services/patientPortal/LabResultsService";
import { queryMyPrescriptions } from "../services/patientPortal/PrescriptionService";

export const getMyPatientRegistrations: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyPatientRegistrations(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getMyAppointments: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyAppointments(authReq.supabase, {
      status: authReq.query.status as string | undefined,
      from_date: authReq.query.from_date as string | undefined,
    });
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const requestAppointment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createAppointmentRequest(authReq.supabase, authReq.body);
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const getMyLabResults: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyLabResults(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getMyPrescriptions: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyPrescriptions(authReq.supabase);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const checkHasPatientRole: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const hasRole = await checkPatientRole(authReq.supabase, authReq.userId);
    sendData(res, { hasRole });
  } catch (err) {
    next(err);
  }
};

