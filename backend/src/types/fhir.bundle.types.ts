// Responsibility: FHIR Bundle type definitions

import { FhirCoding } from "./fhir.base.types";
import {
  FhirPatient,
  FhirEncounter,
  FhirMedicationRequest,
  FhirObservation,
  FhirDiagnosticReport,
} from "./fhir.resource.types";

export interface FhirBundleEntry {
  fullUrl: string;
  resource:
    | FhirPatient
    | FhirEncounter
    | FhirMedicationRequest
    | FhirObservation
    | FhirDiagnosticReport
    | Record<string, unknown>;
}

export interface FhirBundle {
  resourceType: "Bundle";
  id: string;
  identifier: {
    system: string;
    value: string;
  };
  type: "document";
  timestamp: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    profile: string[];
    security?: FhirCoding[];
  };
  entry: FhirBundleEntry[];
}
