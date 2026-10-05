// Responsibility: Orchestrate FHIR Document Bundle construction

import { randomUUID } from "crypto";
import { FhirBundle } from "../../../types/fhir.types";
import { FHIR_PROFILES, COMMON_CODINGS } from "./fhirCodes.data";
import { PatientBuilder } from "./PatientBuilder";
import { EncounterBuilder } from "./EncounterBuilder";
import { MedicationRequestBuilder } from "./MedicationRequestBuilder";
import { DiagnosticReportBuilder } from "./DiagnosticReportBuilder";
import type { BundleData } from "./fhirBuilder.types";

export class FhirBundleBuilder {
  constructor(private hipId: string) {}

  buildBundle(data: BundleData): FhirBundle {
    const bundleId = randomUUID();
    const timestamp = new Date().toISOString();

    const entries = [];

    const patientResource = PatientBuilder.build(data.patient, this.hipId);
    entries.push({
      fullUrl: `urn:uuid:patient-${data.patient.id}`,
      resource: patientResource,
    });

    if (data.encounter) {
      const encounterResource = EncounterBuilder.build(data.encounter);
      entries.push({
        fullUrl: `urn:uuid:encounter-${data.encounter.id}`,
        resource: encounterResource,
      });
    }

    if (data.prescriptionItems && data.prescriptionItems.length > 0) {
      const medications = MedicationRequestBuilder.build(
        data.prescriptionItems,
        {
          patientId: data.patient.id,
          encounterId: data.encounter?.id || "",
          doctorId: data.encounter?.doctor_id || "",
          prescriptionDate: timestamp,
        },
      );

      medications.forEach((med) => {
        entries.push({
          fullUrl: `urn:uuid:medication-request-${med.id}`,
          resource: med,
        });
      });
    }

    if (data.labOrder && data.labResults) {
      const diagnosticReport = DiagnosticReportBuilder.buildReport(
        data.labOrder,
        data.labResults,
      );
      entries.push({
        fullUrl: `urn:uuid:diagnostic-report-${data.labOrder.id}`,
        resource: diagnosticReport,
      });

      const observations = DiagnosticReportBuilder.buildObservations(
        data.labResults,
        data.patient.id,
        data.encounter?.id || "",
      );

      observations.forEach((obs) => {
        entries.push({
          fullUrl: `urn:uuid:observation-${obs.id}`,
          resource: obs,
        });
      });
    }

    return {
      resourceType: "Bundle",
      id: bundleId,
      identifier: {
        system: `${this.hipId}/bundle-ids`,
        value: bundleId,
      },
      type: "document",
      timestamp,
      meta: {
        versionId: "1",
        lastUpdated: timestamp,
        profile: [FHIR_PROFILES.documentBundle],
        security: [COMMON_CODINGS.veryRestricted],
      },
      entry: entries,
    };
  }
}
