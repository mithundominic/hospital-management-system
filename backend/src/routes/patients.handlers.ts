// Responsibility: Route handler implementations for patient management

import { sendData, sendError } from "../utils/respond";
import {
  queryHospitalPatients,
  queryPatientById,
  registerNewPatient,
  updateExistingPatient,
} from "../services/patients/PatientService";
import { AuthenticatedRequest, RouteHandler } from "../types";

export const getPatients: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryHospitalPatients(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getPatient: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    try {
      const data = await queryPatientById(
        authReq.supabase,
        authReq.params.patientId!,
      );
      sendData(res, data);
    } catch (_error) {
      sendError(
        res,
        404,
        "NOT_FOUND",
        "Patient not found or not visible to you",
      );
    }
  } catch (err) {
    next(err);
  }
};

export const createPatient: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await registerNewPatient(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updatePatient: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await updateExistingPatient(
      authReq.supabase,
      authReq.params.patientId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
