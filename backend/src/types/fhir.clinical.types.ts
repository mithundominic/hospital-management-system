// Responsibility: FHIR R4 clinical observation and diagnostic resource types

import type { FhirCodeableConcept, FhirReference } from "./fhir.base.types";

export interface FhirObservation {
  resourceType: "Observation";
  id: string;
  meta: {
    profile: string[];
  };
  status: string;
  category: FhirCodeableConcept[];
  code: FhirCodeableConcept;
  subject: FhirReference;
  encounter?: FhirReference;
  effectiveDateTime?: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  component?: Array<Record<string, unknown>>;
}

export interface FhirDiagnosticReport {
  resourceType: "DiagnosticReport";
  id: string;
  meta: {
    profile: string[];
  };
  status: string;
  category?: FhirCodeableConcept[];
  code: FhirCodeableConcept;
  subject: FhirReference;
  encounter?: FhirReference;
  effectiveDateTime?: string;
  issued?: string;
  performer?: FhirReference[];
  result?: FhirReference[];
}

export interface FhirMedicationRequest {
  resourceType: "MedicationRequest";
  id: string;
  meta: {
    profile: string[];
  };
  status: string;
  intent: string;
  medicationCodeableConcept: FhirCodeableConcept;
  subject: FhirReference;
  encounter?: FhirReference;
  authoredOn: string;
  requester: FhirReference;
  dosageInstruction?: Array<Record<string, unknown>>;
}
