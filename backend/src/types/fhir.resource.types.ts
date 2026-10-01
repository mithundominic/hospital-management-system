// Responsibility: FHIR R4 patient and encounter resource type definitions

import type {
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

export * from "./fhir.clinical.types";
