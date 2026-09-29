// Responsibility: Insurance policies business logic

import { sendData, sendError } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getPolicies: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("insurance_policies")
      .select("*")
      .eq("patient_id", req.params.patientId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createPolicy: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      provider_name,
      tpa_name,
      policy_number,
      valid_from,
      valid_to,
      coverage_details,
    } = req.body;
    const { data, error } = await authReq
      .supabase!.from("insurance_policies")
      .insert({
        patient_id: req.params.patientId,
        provider_name,
        tpa_name,
        policy_number,
        valid_from,
        valid_to,
        coverage_details,
      })
      .select()
      .single();
    if (error) return sendError(res, 403, "FORBIDDEN", error.message);
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};
