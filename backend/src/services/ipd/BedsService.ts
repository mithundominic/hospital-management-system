// Responsibility: IPD beds business logic

import { sendData } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getBeds: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let query = authReq
      .supabase!.from("beds")
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

export const createBed: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { department_id, bed_number, ward } = req.body;
    const { data, error } = await authReq
      .supabase!.from("beds")
      .insert({
        hospital_id: req.params.hospitalId,
        department_id,
        bed_number,
        ward,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateBed: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("beds")
      .update(req.body)
      .eq("id", req.params.bedId)
      .eq("hospital_id", req.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
