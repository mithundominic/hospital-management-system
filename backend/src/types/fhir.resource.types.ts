// Responsibility: FHIR R4 clinical resource type definitions

import {
  FhirCoding,
  FhirCodeableConcept,
  FhirIdentifier,
  FhirReference,
} from "./fhir.base.types";

export interface FhirPatient {
  resourceType: "Patient";
  id: string;
  meta: {
    profile: string[];
  };
  identifier: FhirIdentifier[];
  name: Array<{
    use: string;
    text: string;
    family: string;
    given: string[];
  }>;
  telecom?: Array<{
    system: string;
    value: string;
    use: string;
  }>;
  gender: string;
  birthDate: string;
  address?: Array<{
    use: string;
    text: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
}

export interface FhirEncounter {
  resourceType: "Encounter";
  id: string;
  status: string;
  class: FhirCoding;
  type?: FhirCodeableConcept[];
  subject: FhirReference;
  participant?: Array<{
    type?: FhirCodeableConcept[];
    individual: FhirReference;
  }>;
  period?: {
    start: string;
    end?: string;
  };
  serviceProvider?: FhirReference;
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
