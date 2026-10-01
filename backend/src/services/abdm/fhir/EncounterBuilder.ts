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

const ENCOUNTER_STATUS_MAP: Record<string, string> = {
  completed: "finished",
  active: "in-progress",
  scheduled: "planned",
  cancelled: "cancelled",
  "on-hold": "onleave",
};

export class EncounterBuilder {
  static build(encounter: EncounterData): FhirEncounter {
    return {
      resourceType: "Encounter",
      id: `encounter-${encounter.id}`,
      status: ENCOUNTER_STATUS_MAP[encounter.status] || "unknown",
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
