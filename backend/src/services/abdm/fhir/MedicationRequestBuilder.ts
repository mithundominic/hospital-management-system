// Responsibility: Build FHIR MedicationRequest resources from prescription items

import { FhirMedicationRequest } from "../../../types/fhir.types";
import { FHIR_PROFILES, FHIR_SYSTEMS } from "./fhirCodes.data";

interface PrescriptionItemData {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface BuildContext {
  patientId: string;
  encounterId: string;
  doctorId: string;
  prescriptionDate: string;
}

export class MedicationRequestBuilder {
  static build(
    items: PrescriptionItemData[],
    context: BuildContext,
  ): FhirMedicationRequest[] {
    return items.map((item) => ({
      resourceType: "MedicationRequest",
      id: `medication-request-${item.id}`,
      meta: {
        profile: [FHIR_PROFILES.medicationRequest],
      },
      status: "active",
      intent: "order",
      medicationCodeableConcept: {
        coding: [
          {
            system: FHIR_SYSTEMS.snomed,
            code: "unknown",
            display: item.medicine_name,
          },
        ],
        text: `${item.medicine_name} ${item.dosage}`,
      },
      subject: {
        reference: `urn:uuid:patient-${context.patientId}`,
      },
      encounter: {
        reference: `urn:uuid:encounter-${context.encounterId}`,
      },
      authoredOn: context.prescriptionDate,
      requester: {
        reference: `urn:uuid:practitioner-${context.doctorId}`,
      },
      dosageInstruction: [
        {
          text: `${item.frequency}, ${item.duration}`,
        },
      ],
    }));
  }
}
