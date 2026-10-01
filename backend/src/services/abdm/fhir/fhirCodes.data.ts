// Responsibility: SNOMED CT / LOINC code mappings for FHIR resources

import { FhirCoding } from "../../../types/fhir.types";

export const FHIR_PROFILES = {
  patient: "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient",
  practitioner:
    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Practitioner",
  organization:
    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Organization",
  documentBundle:
    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle",
  medicationRequest:
    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/MedicationRequest",
  observation:
    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/ObservationVitalSigns",
  diagnosticReport:
    "https://nrces.in/ndhm/fhir/r4/StructureDefinition/DiagnosticReport",
} as const;

export const FHIR_SYSTEMS = {
  snomed: "http://snomed.info/sct",
  loinc: "http://loinc.org",
  icd10: "http://hl7.org/fhir/sid/icd-10",
  abhaNumber: "https://healthid.ndhm.gov.in",
  hfrFacility: "https://facility.ndhm.gov.in",
  doctorLicense: "https://doctor.ndhm.gov.in",
  ucum: "http://unitsofmeasure.org",
  v2IdType: "http://terminology.hl7.org/CodeSystem/v2-0203",
  observationCategory:
    "http://terminology.hl7.org/CodeSystem/observation-category",
  v3ActCode: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
  confidentiality:
    "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
} as const;

export const COMMON_CODINGS = {
  medicalRecordNumber: {
    system: FHIR_SYSTEMS.v2IdType,
    code: "MR",
    display: "Medical record number",
  },
  socialBeneficiary: {
    system: FHIR_SYSTEMS.v2IdType,
    code: "SB",
    display: "Social Beneficiary Identifier",
  },
  providerNumber: {
    system: FHIR_SYSTEMS.v2IdType,
    code: "PRN",
    display: "Provider number",
  },
  ambulatory: {
    system: FHIR_SYSTEMS.v3ActCode,
    code: "AMB",
    display: "ambulatory",
  },
  vitalSigns: {
    system: FHIR_SYSTEMS.observationCategory,
    code: "vital-signs",
    display: "Vital Signs",
  },
  veryRestricted: {
    system: FHIR_SYSTEMS.confidentiality,
    code: "V",
    display: "very restricted",
  },
} as const;

export const LOINC_CODES: Record<string, FhirCoding> = {
  bloodPressure: {
    system: FHIR_SYSTEMS.loinc,
    code: "85354-9",
    display: "Blood pressure panel with all children optional",
  },
  systolicBP: {
    system: FHIR_SYSTEMS.loinc,
    code: "8480-6",
    display: "Systolic blood pressure",
  },
  diastolicBP: {
    system: FHIR_SYSTEMS.loinc,
    code: "8462-4",
    display: "Diastolic blood pressure",
  },
  bodyTemp: {
    system: FHIR_SYSTEMS.loinc,
    code: "8310-5",
    display: "Body temperature",
  },
  heartRate: {
    system: FHIR_SYSTEMS.loinc,
    code: "8867-4",
    display: "Heart rate",
  },
} as const;
