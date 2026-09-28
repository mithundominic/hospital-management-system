// Responsibility: Type definitions for ABDM workflows, verification, and consent entities

export interface LinkRequest {
  id: string;
  link_type: string;
  status: string;
  abdm_request_id?: string;
  initiated_at: string;
  resolved_at?: string;
}

export interface ConsentArtifact {
  id: string;
  consent_request_id?: string;
  artifact_id?: string;
  purpose: string;
  status: "requested" | "granted" | "denied" | "expired";
  requested_at: string;
  resolved_at?: string;
}

export interface AbdmEncounter {
  id: string;
  encounter_type: string;
  chief_complaint?: string;
  diagnosis?: string;
  started_at: string;
  status: string;
}

export interface AbhaVerificationResponse {
  abdm_request_id: string;
}
