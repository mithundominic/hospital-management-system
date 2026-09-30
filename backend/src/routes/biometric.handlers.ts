// Responsibility: Biometric device route handler functions

import { AuthenticatedRequest, RouteHandler } from "../types";
import { sendData } from "../utils/respond";
import * as DeviceService from "../services/biometric/BiometricDeviceService";

export const getDevices: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await DeviceService.listDevices(
      authReq.supabase!,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getDevice: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await DeviceService.getDevice(
      authReq.supabase!,
      authReq.params.deviceId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createDeviceHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await DeviceService.createDevice(
      authReq.supabase!,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateDeviceHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await DeviceService.updateDevice(
      authReq.supabase!,
      authReq.params.deviceId!,
      authReq.body,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const updateDeviceStatusHandler: RouteHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { status } = authReq.body;
    const data = await DeviceService.updateDeviceStatus(
      authReq.supabase!,
      authReq.params.deviceId!,
      status,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const deleteDeviceHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    await DeviceService.deleteDevice(
      authReq.supabase!,
      authReq.params.deviceId!,
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
