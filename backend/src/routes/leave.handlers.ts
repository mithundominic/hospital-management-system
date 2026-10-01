// Responsibility: Leave application route handler functions

import {
  queryLeaveApplications,
  createLeaveApplication,
  approveLeave,
  rejectLeave,
} from "../services/attendance/LeaveService";
import { AuthenticatedRequest, RouteHandler } from "../types";
import { sendData } from "../utils/respond";

export const getLeaveApplications: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryLeaveApplications(
      authReq.supabase,
      authReq.params.hospitalId!,
      {
        user_id: authReq.query.user_id as string | undefined,
        status: authReq.query.status as string | undefined,
      },
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createLeave: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createLeaveApplication(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.userId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const approveLeaveHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await approveLeave(
      authReq.supabase,
      authReq.params.leaveId!,
      authReq.userId!,
      authReq.params.hospitalId,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const rejectLeaveHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await rejectLeave(
      authReq.supabase,
      authReq.params.leaveId!,
      authReq.userId!,
      authReq.body.reason || "No reason provided",
      authReq.params.hospitalId,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
