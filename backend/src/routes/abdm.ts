// backend/src/routes/abdm.ts
// Responsibility: Staff-facing ABDM operations with proper auth

import { Router } from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AbdmClient } from "../services/AbdmClient";
import {
  AuthenticatedRequest,
  RouteHandler,
  InitiateAbhaVerificationRequest,
  ConfirmAbhaLinkRequest,
  RequestConsentRequest,
} from "../types";

const router = Router();
const abdmClient = new AbdmClient();

const getLinkRequests: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("abdm_link_requests")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId)
      .eq("patient_id", authReq.params.patientId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const initiateVerification: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { abha_address } = authReq.body as InitiateAbhaVerificationRequest;

    const { data: linkRequest, error } = await authReq.supabase
      .from("abdm_link_requests")
      .insert({
        hospital_id: authReq.params.hospitalId,
        patient_id: authReq.params.patientId,
        link_type: "abha_verification",
        status: "initiated",
      })
      .select()
      .single();
    if (error) throw error;

    const abdmResponse = await abdmClient.initiateAbhaVerification({
      abhaAddress: abha_address,
      hospitalId: authReq.params.hospitalId!,
      patientId: authReq.params.patientId!,
    });

    await authReq.supabase
      .from("abdm_link_requests")
      .update({ abdm_request_id: abdmResponse.transactionId })
      .eq("id", linkRequest.id);

    sendData(
      res,
      { ...linkRequest, abdm_request_id: abdmResponse.transactionId },
      202,
    );
  } catch (err) {
    next(err);
  }
};

const confirmVerification: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { transaction_id, otp } = authReq.body as ConfirmAbhaLinkRequest;

    await abdmClient.confirmAbhaLink({ transactionId: transaction_id, otp });
    sendData(res, { submitted: true }, 202);
  } catch (err) {
    next(err);
  }
};

const requestConsent: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { abha_address, purpose } = authReq.body as RequestConsentRequest;

    const { data: artifact, error } = await authReq.supabase
      .from("abdm_consent_artifacts")
      .insert({
        hospital_id: authReq.params.hospitalId,
        patient_id: authReq.params.patientId,
        purpose,
        status: "requested",
      })
      .select()
      .single();
    if (error) throw error;

    const abdmResponse = await abdmClient.requestConsent({
      abhaAddress: abha_address,
      purpose,
      hospitalId: authReq.params.hospitalId!,
    });

    const responseWithConsent = abdmResponse as {
      consentRequest?: { id: string };
    };
    const consentRequestId = responseWithConsent?.consentRequest?.id;
    if (consentRequestId) {
      await authReq.supabase
        .from("abdm_consent_artifacts")
        .update({ consent_request_id: consentRequestId })
        .eq("id", artifact.id);
    }

    sendData(res, artifact, 202);
  } catch (err) {
    next(err);
  }
};

router.get(
  "/hospitals/:hospitalId/patients/:patientId/abdm/link-requests",
  requireHospitalPermission(PERMISSIONS.ABDM_READ),
  getLinkRequests,
);

router.post(
  "/hospitals/:hospitalId/patients/:patientId/abdm/verify",
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  initiateVerification,
);

router.post(
  "/hospitals/:hospitalId/patients/:patientId/abdm/confirm",
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  confirmVerification,
);

router.post(
  "/hospitals/:hospitalId/patients/:patientId/abdm/consent-requests",
  requireHospitalPermission(PERMISSIONS.ABDM_WRITE),
  requestConsent,
);

export default router;
