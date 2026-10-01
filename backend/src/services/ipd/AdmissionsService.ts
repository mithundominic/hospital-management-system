// Responsibility: IPD admissions business logic

import { sendData, sendError } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getAdmissions: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq
      .supabase!.from("admissions")
      .select("*")
      .eq("hospital_id", req.params.hospitalId);
    if (req.query.status)
      query = query.eq("status", req.query.status as string);
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
    const { encounter_id, patient_id, bed_id, admitting_doctor_membership_id } =
      req.body;
    const { data, error } = await authReq
      .supabase!.from("admissions")
      .insert({
        hospital_id: req.params.hospitalId,
        encounter_id,
        patient_id,
        bed_id,
        admitting_doctor_membership_id,
      })
      .select()
      .single();
    if (error) {
      const msg = error.code === "23505"
        ? "The selected bed is already occupied"
        : "Unable to process admission request";
      return sendError(res, 409, "CONFLICT", msg);
    }
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateAdmission: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { status, bed_id, discharge_date, discharge_notes } = req.body || {};
    const updates = {
      ...(status !== undefined && { status }),
      ...(bed_id !== undefined && { bed_id }),
      ...(discharge_date !== undefined && { discharge_date }),
      ...(discharge_notes !== undefined && { discharge_notes }),
    };

    const { data, error } = await authReq
      .supabase!.from("admissions")
      .update(updates)
      .eq("id", req.params.admId)
      .eq("hospital_id", req.params.hospitalId)
      .select()
      .single();
    if (error) {
      const msg = error.code === "23505"
        ? "The selected bed is already occupied"
        : "Unable to update admission";
      return sendError(res, 409, "CONFLICT", msg);
    }
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
