// Responsibility: Base FHIR primitive and common type definitions

export interface FhirCoding {
  system: string;
  code: string;
  display: string;
}

export interface FhirCodeableConcept {
  coding: FhirCoding[];
  text?: string;
}

export interface FhirIdentifier {
  type?: FhirCodeableConcept;
  system: string;
  value: string;
}

export interface FhirReference {
  reference: string;
  display?: string;
}
