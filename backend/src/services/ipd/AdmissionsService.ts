// Responsibility: IPD admissions business logic

import { sendData, sendError } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getAdmissions: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq.supabase!
      .from("admissions")
      .select("*")
      .eq("hospital_id", req.params.hospitalId);
    if (req.query.status) query = query.eq("status", req.query.status as string);
    const { data, error } = await query;
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createAdmission: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { encounter_id, patient_id, bed_id, admitting_doctor_membership_id } = req.body;
    const { data, error } = await authReq.supabase!
      .from("admissions")
      .insert({
        hospital_id: req.params.hospitalId,
        encounter_id,
        patient_id,
        bed_id,
        admitting_doctor_membership_id,
      })
      .select()
      .single();
    if (error) return sendError(res, 409, "CONFLICT", error.message);
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateAdmission: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase!
      .from("admissions")
      .update(req.body)
      .eq("id", req.params.admId)
      .eq("hospital_id", req.params.hospitalId)
      .select()
      .single();
    if (error) return sendError(res, 409, "CONFLICT", error.message);
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
