// Responsibility: Build FHIR DiagnosticReport and Observation resources

import {
  FhirDiagnosticReport,
  FhirObservation,
} from "../../../types/fhir.types";
import { FHIR_PROFILES, FHIR_SYSTEMS, COMMON_CODINGS } from "./fhirCodes.data";

interface LabOrderData {
  id: string;
  test_name: string;
  patient_id: string;
  encounter_id: string;
  ordered_at: string;
  status: string;
}

interface LabResultData {
  id: string;
  parameter: string;
  value: string;
  unit?: string;
  reported_at: string;
}

export class DiagnosticReportBuilder {
  static buildReport(
    order: LabOrderData,
    results: LabResultData[],
  ): FhirDiagnosticReport {
    return {
      resourceType: "DiagnosticReport",
      id: `diagnostic-report-${order.id}`,
      meta: {
        profile: [FHIR_PROFILES.diagnosticReport],
      },
      status: order.status === "completed" ? "final" : "preliminary",
      code: {
        coding: [
          {
            system: FHIR_SYSTEMS.loinc,
            code: "unknown",
            display: order.test_name,
          },
        ],
        text: order.test_name,
      },
      subject: {
        reference: `urn:uuid:patient-${order.patient_id}`,
      },
      encounter: {
        reference: `urn:uuid:encounter-${order.encounter_id}`,
      },
      effectiveDateTime: order.ordered_at,
      issued: results[0]?.reported_at || order.ordered_at,
      result: results.map((r) => ({
        reference: `urn:uuid:observation-${r.id}`,
      })),
    };
  }

  static buildObservations(
    results: LabResultData[],
    patientId: string,
    encounterId: string,
  ): FhirObservation[] {
    return results.map((result) => ({
      resourceType: "Observation",
      id: `observation-${result.id}`,
      meta: {
        profile: [FHIR_PROFILES.observation],
      },
      status: "final",
      category: [{ coding: [COMMON_CODINGS.vitalSigns] }],
      code: {
        coding: [
          {
            system: FHIR_SYSTEMS.loinc,
            code: "unknown",
            display: result.parameter,
          },
        ],
        text: result.parameter,
      },
      subject: {
        reference: `urn:uuid:patient-${patientId}`,
      },
      encounter: {
        reference: `urn:uuid:encounter-${encounterId}`,
      },
      effectiveDateTime: result.reported_at,
      valueQuantity: result.unit
        ? {
            value: parseFloat(result.value) || 0,
            unit: result.unit,
            system: FHIR_SYSTEMS.ucum,
            code: result.unit,
          }
        : undefined,
    }));
  }
}
