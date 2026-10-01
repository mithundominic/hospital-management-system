// Responsibility: Database logging and status updates for inbound ABDM gateway callbacks

import { adminClient } from "../../config/supabase";
import type {
  AbdmAuthInitCallback,
  AbdmAuthConfirmCallback,
  AbdmConsentRequestInitCallback,
  AbdmConsentHiuNotifyCallback,
} from "../../types";

export const logCallback = async (
  callbackType: string,
  body: Record<string, unknown>,
): Promise<void> => {
  await adminClient.from("abdm_callback_log").insert({
    callback_type: callbackType,
    abdm_request_id:
      (body?.resp as { requestId?: string } | undefined)?.requestId ||
      (typeof body?.requestId === "string" ? body.requestId : null),
    payload: body,
  });
};

export const processAuthOnInit = async (
  body: AbdmAuthInitCallback,
): Promise<void> => {
  await logCallback("users/auth/on-init", body);
  const transactionId = body.transactionId;
  if (transactionId) {
    await adminClient
      .from("abdm_link_requests")
      .update({ abdm_request_id: transactionId, status: "otp_sent" })
      .eq("abdm_request_id", transactionId);
  }
};

export const processAuthOnConfirm = async (
  body: AbdmAuthConfirmCallback,
): Promise<void> => {
  await logCallback("users/auth/on-confirm", body);
  const transactionId = body.transactionId;
  if (transactionId) {
    const succeeded = !body.error;
    await adminClient
      .from("abdm_link_requests")
      .update({
        status: succeeded ? "confirmed" : "failed",
        resolved_at: new Date().toISOString(),
      })
      .eq("abdm_request_id", transactionId);
  }
};

export const processLinkOnInit = async (
  body: Record<string, unknown>,
): Promise<void> => {
  await logCallback("links/link/on-init", body);
};

export const processConsentOnInit = async (
  body: AbdmConsentRequestInitCallback,
): Promise<void> => {
  await logCallback("consent-requests/on-init", body);
  const requestId = body.consentRequest?.id;
  if (requestId) {
    await adminClient
      .from("abdm_consent_artifacts")
      .update({ consent_request_id: requestId })
      .eq("consent_request_id", requestId);
  }
};

export const processHiuNotify = async (
  body: AbdmConsentHiuNotifyCallback,
): Promise<void> => {
  await logCallback("consents/hiu/notify", body);
  const artifactId = body.notification?.consentArtefacts?.[0]?.id;
  const status = body.notification?.status;

  if (artifactId) {
    await adminClient
      .from("abdm_consent_artifacts")
      .update({
        artifact_id: artifactId,
        status: status === "GRANTED" ? "granted" : "denied",
        resolved_at: new Date().toISOString(),
      })
      .eq("consent_request_id", body.notification.consentRequestId);
  }
};

interface HipDataRequestCallback extends Record<string, unknown> {
  transactionId: string;
  hiRequest: {
    consent: {
      id: string;
    };
  };
}

export const processHipDataRequest = async (
  body: HipDataRequestCallback,
): Promise<void> => {
  await logCallback("health-information/hip/request", body);
  const consentId = body.hiRequest?.consent?.id;
  const transactionId = body.transactionId;

  if (consentId && transactionId) {
    const { AbdmHipService } = await import("./AbdmHipService");
    const hipService = new AbdmHipService();
    await hipService.pushHealthInformation(consentId, transactionId);
  }
};
