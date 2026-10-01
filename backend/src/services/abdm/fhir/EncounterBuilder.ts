// Responsibility: Build FHIR Encounter resource from database encounter record

import { FhirEncounter } from "../../../types/fhir.types";
import { COMMON_CODINGS } from "./fhirCodes.data";

interface EncounterData {
  id: string;
  patient_id: string;
  doctor_id: string;
  encounter_date: string;
  status: string;
}

export class EncounterBuilder {
  static build(encounter: EncounterData): FhirEncounter {
    return {
      resourceType: "Encounter",
      id: `encounter-${encounter.id}`,
      status: encounter.status === "completed" ? "finished" : "in-progress",
      class: COMMON_CODINGS.ambulatory,
      subject: {
        reference: `urn:uuid:patient-${encounter.patient_id}`,
      },
      participant: [
        {
          individual: {
            reference: `urn:uuid:practitioner-${encounter.doctor_id}`,
          },
        },
      ],
      period: {
        start: new Date(encounter.encounter_date).toISOString(),
      },
    };
  }
}
