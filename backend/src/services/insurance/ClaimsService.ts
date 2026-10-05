// Responsibility: Insurance claims business logic

import { sendData } from "../../utils/respond";
import { RouteHandler } from "../../types";
import { AuthenticatedRequest } from "../../types/express.types";

export const getClaims: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("insurance_claims")
      .select("id, hospital_id, invoice_id, insurance_policy_id, claim_number, claim_type, status, claimed_amount, approved_amount, handled_by, submitted_at, settled_at, rejection_reason, created_at")
      .eq("hospital_id", req.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const createClaim: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      invoice_id,
      insurance_policy_id,
      claim_type,
      claimed_amount,
      handled_by,
    } = req.body;
    const { data, error } = await authReq
      .supabase!.from("insurance_claims")
      .insert({
        hospital_id: req.params.hospitalId,
        invoice_id,
        insurance_policy_id,
        claim_type,
        claimed_amount,
        handled_by,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateClaim: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq
      .supabase!.from("insurance_claims")
      .update(req.body)
      .eq("id", req.params.claimId)
      .eq("hospital_id", req.params.hospitalId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};
