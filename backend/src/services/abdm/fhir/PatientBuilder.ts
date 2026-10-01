// Responsibility: Build FHIR Patient resource from database patient record

import { FhirPatient } from "../../../types/fhir.types";
import { FHIR_PROFILES, FHIR_SYSTEMS, COMMON_CODINGS } from "./fhirCodes.data";

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number?: string;
  abha_address?: string;
}

export class PatientBuilder {
  static build(patient: PatientData, hipId: string): FhirPatient {
    const identifiers = [
      {
        type: {
          coding: [COMMON_CODINGS.medicalRecordNumber],
        },
        system: `${hipId}/patient-ids`,
        value: patient.id,
      },
    ];

    if (patient.abha_address) {
      identifiers.push({
        type: {
          coding: [COMMON_CODINGS.socialBeneficiary],
        },
        system: FHIR_SYSTEMS.abhaNumber,
        value: patient.abha_address,
      });
    }

    const telecom = patient.contact_number
      ? [
          {
            system: "phone",
            value: patient.contact_number,
            use: "mobile",
          },
        ]
      : undefined;

    return {
      resourceType: "Patient",
      id: `patient-${patient.id}`,
      meta: {
        profile: [FHIR_PROFILES.patient],
      },
      identifier: identifiers,
      name: [
        {
          use: "official",
          text: `${patient.first_name} ${patient.last_name}`,
          family: patient.last_name,
          given: [patient.first_name],
        },
      ],
      telecom,
      gender: patient.gender.toLowerCase(),
      birthDate: patient.date_of_birth,
    };
  }
}
