// backend/src/types/abdm.types.ts
// Responsibility: ABDM/ABHA data structure type definitions

/**
 * ABDM Link Request statuses
 */
export type AbdmLinkStatus = "initiated" | "otp_sent" | "confirmed" | "failed";

/**
 * ABDM Consent Artifact statuses
 */
export type AbdmConsentStatus = "requested" | "granted" | "denied" | "expired";

/**
 * ABDM Link Request (M1 - ABHA verification)
 */
export interface AbdmLinkRequest {
  id: string;
  hospital_id: string;
  patient_id: string;
  link_type: string;
  abdm_request_id?: string;
  status: AbdmLinkStatus;
  initiated_at: string;
  resolved_at?: string;
}

/**
 * ABDM Consent Artifact (M3 - consent management)
 */
export interface AbdmConsentArtifact {
  id: string;
  hospital_id: string;
  patient_id: string;
  consent_request_id?: string;
  artifact_id?: string;
  purpose: string;
  status: AbdmConsentStatus;
  requested_at: string;
  resolved_at?: string;
}

/**
 * ABDM Callback Log entry
 */
export interface AbdmCallbackLog {
  id: string;
  callback_type: string;
  abdm_request_id?: string;
  payload: Record<string, unknown>;
  received_at: string;
}

/**
 * M1: Initiate ABHA Verification Request
 */
export interface InitiateAbhaVerificationRequest {
  abha_address: string;
}

/**
 * M1: Confirm ABHA Link Request (OTP submission)
 */
export interface ConfirmAbhaLinkRequest {
  transaction_id: string;
  otp: string;
}

/**
 * M2: Link Care Context Request
 */
export interface LinkCareContextRequest {
  abha_address: string;
  care_context_reference: string;
}

/**
 * M3: Request Consent
 */
export interface RequestConsentRequest {
  abha_address: string;
  purpose: string;
}

/**
 * ABDM Gateway Session Response
 */
export interface AbdmSessionResponse {
  accessToken: string;
  expiresIn?: number;
  tokenType?: string;
}

/**
 * ABDM Gateway Error Response
 */
export interface AbdmErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * M1: Auth Init Callback Payload
 */
export interface AbdmAuthInitCallback extends Record<string, unknown> {
  requestId?: string;
  transactionId?: string;
  timestamp: string;
  auth?: {
    transactionId: string;
    mode: string;
    meta?: {
      hint?: string;
      expiry?: string;
    };
  };
  error?: AbdmErrorResponse;
  resp?: {
    requestId: string;
  };
}

/**
 * M1: Auth Confirm Callback Payload
 */
export interface AbdmAuthConfirmCallback extends Record<string, unknown> {
  requestId?: string;
  transactionId?: string;
  timestamp: string;
  auth?: {
    accessToken: string;
    patient: {
      id: string;
      name?: string;
      gender?: string;
      yearOfBirth?: number;
    };
  };
  error?: AbdmErrorResponse;
  resp?: {
    requestId: string;
  };
}

/**
 * M2: Link Init Callback Payload
 */
export interface AbdmLinkInitCallback extends Record<string, unknown> {
  requestId: string;
  timestamp: string;
  acknowledgement?: {
    status: string;
  };
  error?: AbdmErrorResponse;
  resp?: {
    requestId: string;
  };
}

/**
 * M3: Consent Request Init Callback Payload
 */
export interface AbdmConsentRequestInitCallback extends Record<
  string,
  unknown
> {
  requestId: string;
  timestamp: string;
  consentRequest?: {
    id: string;
  };
  error?: AbdmErrorResponse;
  resp?: {
    requestId: string;
  };
}

/**
 * M3: Consent HIU Notify Callback Payload
 */
export interface AbdmConsentHiuNotifyCallback extends Record<string, unknown> {
  requestId: string;
  timestamp: string;
  notification: {
    consentRequestId: string;
    status: "GRANTED" | "DENIED" | "REVOKED" | "EXPIRED";
    consentArtefacts?: Array<{
      id: string;
    }>;
  };
  resp?: {
    requestId: string;
  };
}

/**
 * Generic ABDM Callback Payload
 */
export type AbdmCallbackPayload =
  | AbdmAuthInitCallback
  | AbdmAuthConfirmCallback
  | AbdmLinkInitCallback
  | AbdmConsentRequestInitCallback
  | AbdmConsentHiuNotifyCallback;
