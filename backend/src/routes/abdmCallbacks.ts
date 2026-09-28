// backend/src/routes/abdmCallbacks.ts
// Responsibility: Inbound ABDM gateway callbacks (NO user auth)
//
// SECURITY GAP: ABDM callback signature verification NOT implemented.
// See docs/PHASE5_ABDM_INTEGRATION.md for production requirements.

import { Router, Request, Response } from "express";
import { adminClient } from "../config/supabase";
import {
  AbdmAuthInitCallback,
  AbdmAuthConfirmCallback,
  AbdmLinkInitCallback,
  AbdmConsentRequestInitCallback,
  AbdmConsentHiuNotifyCallback,
} from "../types";

const router = Router();

async function logCallback(
  callbackType: string,
  body: Record<string, unknown>,
): Promise<void> {
  await adminClient.from("abdm_callback_log").insert({
    callback_type: callbackType,
    abdm_request_id: (body?.resp as any)?.requestId || body?.requestId || null,
    payload: body,
  });
}

// M1: Result of initiateAbhaVerification()
router.post(
  "/abdm/callbacks/users/auth/on-init",
  async (req: Request, res: Response) => {
    const body = req.body as AbdmAuthInitCallback;
    await logCallback("users/auth/on-init", body);

    const transactionId = body.transactionId;
    if (transactionId) {
      await adminClient
        .from("abdm_link_requests")
        .update({ abdm_request_id: transactionId, status: "otp_sent" })
        .eq("abdm_request_id", transactionId);
    }

    res.status(202).json({ received: true });
  },
);

// M1: Result of confirmAbhaLink()
router.post(
  "/abdm/callbacks/users/auth/on-confirm",
  async (req: Request, res: Response) => {
    const body = req.body as AbdmAuthConfirmCallback;
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

    res.status(202).json({ received: true });
  },
);

// M2: Result of linkCareContext()
router.post(
  "/abdm/callbacks/links/link/on-init",
  async (req: Request, res: Response) => {
    const body = req.body as AbdmLinkInitCallback;
    await logCallback("links/link/on-init", body);
    res.status(202).json({ received: true });
  },
);

// M3: Result of requestConsent()
router.post(
  "/abdm/callbacks/consent-requests/on-init",
  async (req: Request, res: Response) => {
    const body = req.body as AbdmConsentRequestInitCallback;
    await logCallback("consent-requests/on-init", body);

    const requestId = body.consentRequest?.id;
    if (requestId) {
      await adminClient
        .from("abdm_consent_artifacts")
        .update({ consent_request_id: requestId })
        .eq("consent_request_id", requestId);
    }

    res.status(202).json({ received: true });
  },
);

// M3: Patient granted/denied consent via Consent Manager app
router.post(
  "/abdm/callbacks/consents/hiu/notify",
  async (req: Request, res: Response) => {
    const body = req.body as AbdmConsentHiuNotifyCallback;
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

    res.status(202).json({ received: true });
  },
);

export default router;
