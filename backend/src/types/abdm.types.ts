// Responsibility: ABDM/ABHA data structure type definitions

export type AbdmLinkStatus = "initiated" | "otp_sent" | "confirmed" | "failed";
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
}

export * from "./abdmCallback.types";
