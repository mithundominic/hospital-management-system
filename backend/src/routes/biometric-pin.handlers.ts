// Responsibility: Employee PIN mapping route handler functions

import { AuthenticatedRequest, RouteHandler } from "../types";
import { sendData } from "../utils/respond";
import * as PinService from "../services/biometric/EmployeePinService";

export const getPinMappings: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await PinService.listPinMappings(
      authReq.supabase!,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createPinMappingHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { user_id, biometric_pin } = authReq.body;
    const data = await PinService.createPinMapping(
      authReq.supabase!,
      authReq.params.hospitalId!,
      user_id,
      biometric_pin,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updatePinMappingHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { biometric_pin } = authReq.body;
    const data = await PinService.updatePinMapping(
      authReq.supabase!,
      authReq.params.mappingId!,
      biometric_pin,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const deletePinMappingHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    await PinService.deletePinMapping(
      authReq.supabase!,
      authReq.params.mappingId!,
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
