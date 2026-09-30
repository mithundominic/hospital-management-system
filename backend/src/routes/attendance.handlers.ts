// Responsibility: Attendance route handler functions

import {
  queryAttendanceRecords,
  queryMyAttendanceRecords,
  checkIn,
  checkOut,
} from "../services/attendance/AttendanceService";
import { AuthenticatedRequest, RouteHandler } from "../types";
import { sendData } from "../utils/respond";

export const getAttendanceRecords: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryAttendanceRecords(
      authReq.supabase,
      authReq.params.hospitalId!,
      {
        date: authReq.query.date as string | undefined,
        user_id: authReq.query.user_id as string | undefined,
        status: authReq.query.status as string | undefined,
      },
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const getMyAttendanceRecords: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryMyAttendanceRecords(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.userId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const checkInHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await checkIn(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.userId!,
      authReq.body.notes,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const checkOutHandler: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await checkOut(authReq.supabase, authReq.body.attendance_id);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
