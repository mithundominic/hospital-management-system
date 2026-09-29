// Responsibility: Departments business logic

import { sendData } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getDepartments: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("departments")
      .select("*")
      .eq("hospital_id", req.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createDepartment: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { name } = req.body;
    const { data, error } = await authReq
      .supabase!.from("departments")
      .insert({ hospital_id: req.params.hospitalId, name })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};
