// Responsibility: Doctor profiles business logic

import { sendData } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getDoctors: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("doctor_profiles")
      .select("id, membership_id, department_id, specialization, registration_number, qualifications, consultation_fee, created_at, memberships!inner(hospital_id, user_id)")
      .eq("memberships.hospital_id", req.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createDoctor: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      membership_id,
      department_id,
      specialization,
      registration_number,
      qualifications,
      consultation_fee,
    } = req.body;
    const { data, error } = await authReq
      .supabase!.from("doctor_profiles")
      .insert({
        membership_id,
        department_id,
        specialization,
        registration_number,
        qualifications,
        consultation_fee,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateDoctor: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("doctor_profiles")
      .update(req.body)
      .eq("id", req.params.doctorId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
