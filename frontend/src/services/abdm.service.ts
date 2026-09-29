// Responsibility: ABDM domain service for ABHA verification, consents, and care context linking

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type {
  LinkRequest,
  ConsentArtifact,
  AbhaVerificationResponse,
} from "@/pages/abdm/abdm.types";

export const getAbhaLinkRequests = async (
  hospitalId: string,
  patientId: string,
): Promise<LinkRequest[]> => {
  return await api.get<LinkRequest[]>(
    API_ROUTES.hospitals.abdm.linkRequests(hospitalId, patientId),
  );
};

export const initiateAbhaVerification = async (
  hospitalId: string,
  patientId: string,
  payload: { abha_address: string },
): Promise<AbhaVerificationResponse> => {
  return await api.post<AbhaVerificationResponse>(
    API_ROUTES.hospitals.abdm.verify(hospitalId, patientId),
    payload,
  );
};

export const confirmAbhaVerification = async (
  hospitalId: string,
  patientId: string,
  payload: { transaction_id: string; otp: string },
): Promise<unknown> => {
  return await api.post(
    API_ROUTES.hospitals.abdm.confirm(hospitalId, patientId),
    payload,
  );
};

export const getConsentArtifacts = async (
  hospitalId: string,
  patientId: string,
): Promise<ConsentArtifact[]> => {
  return await api.get<ConsentArtifact[]>(
    API_ROUTES.hospitals.abdm.consents(hospitalId, patientId),
  );
};

export const createConsentRequest = async (
  hospitalId: string,
  patientId: string,
  payload: { abha_address: string; purpose: string },
): Promise<unknown> => {
  return await api.post(
    API_ROUTES.hospitals.abdm.consentRequests(hospitalId, patientId),
    payload,
  );
};

export const linkCareContext = async (
  hospitalId: string,
  patientId: string,
  payload: { abha_address: string; care_context_reference: string },
): Promise<unknown> => {
  return await api.post(
    API_ROUTES.hospitals.abdm.linkCareContext(hospitalId, patientId),
    payload,
  );
};
