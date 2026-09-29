// Responsibility: Route handler implementations for ABDM consent operations

import { sendData } from "../utils/respond";
import { requestConsentWorkflow } from "../services/abdm/AbdmWorkflowService";
import {
  AuthenticatedRequest,
  RouteHandler,
  RequestConsentRequest,
} from "../types";

export const requestConsent: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { abha_address, purpose } = authReq.body as RequestConsentRequest;

    const artifact = await requestConsentWorkflow(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.patientId!,
      abha_address,
      purpose,
    );

    sendData(res, artifact, 202);
  } catch (err) {
    next(err);
  }
};
