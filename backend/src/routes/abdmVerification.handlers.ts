// Responsibility: Route handler implementations for ABHA verification operations

import { sendData } from "../utils/respond";
import {
  queryLinkRequests,
  initiateAbhaVerificationWorkflow,
  confirmAbhaVerificationWorkflow,
} from "../services/abdm/AbdmWorkflowService";
import {
  AuthenticatedRequest,
  RouteHandler,
  InitiateAbhaVerificationRequest,
  ConfirmAbhaLinkRequest,
} from "../types";

export const getLinkRequests: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryLinkRequests(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.patientId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

export const initiateVerification: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { abha_address } = authReq.body as InitiateAbhaVerificationRequest;

    const result = await initiateAbhaVerificationWorkflow(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.patientId!,
      abha_address,
    );

    sendData(res, result, 202);
  } catch (err) {
    next(err);
  }
};

export const confirmVerification: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { transaction_id, otp } = authReq.body as ConfirmAbhaLinkRequest;

    await confirmAbhaVerificationWorkflow(transaction_id, otp);
    sendData(res, { submitted: true }, 202);
  } catch (err) {
    next(err);
  }
};
