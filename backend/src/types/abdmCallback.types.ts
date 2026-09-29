// Responsibility: ABDM callback payload type definitions

import { AbdmErrorResponse } from "./abdm.types";

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

export type AbdmCallbackPayload =
  | AbdmAuthInitCallback
  | AbdmAuthConfirmCallback
  | AbdmLinkInitCallback
  | AbdmConsentRequestInitCallback
  | AbdmConsentHiuNotifyCallback;
