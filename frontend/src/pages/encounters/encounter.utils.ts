// Responsibility: Pure utility functions for initializing encounter forms and formatting clinical vitals payloads

import type { Encounter } from "@/types";
import type { EncounterFormData } from "./encounter.types";

export const getInitialEncounterFormData = (
  encounter?: Encounter | null,
): EncounterFormData => ({
  patient_id: encounter?.patient_id || "",
  doctor_id: encounter?.doctor_id || "",
  encounter_type: encounter?.encounter_type || "opd",
  chief_complaint: encounter?.chief_complaint || "",
  diagnosis: encounter?.diagnosis || "",
  notes: encounter?.notes || "",
  status: "in-progress",
  temperature: "",
  blood_pressure_systolic: "",
  blood_pressure_diastolic: "",
  pulse_rate: "",
  respiratory_rate: "",
  oxygen_saturation: "",
  weight: "",
  height: "",
});

export const formatEncounterVitals = (
  formData: EncounterFormData,
): Record<string, unknown> | null => {
  const vitals: Record<string, unknown> = {};
  if (formData.temperature) vitals.temperature = Number(formData.temperature);
  if (formData.blood_pressure_systolic && formData.blood_pressure_diastolic) {
    vitals.blood_pressure = {
      systolic: Number(formData.blood_pressure_systolic),
      diastolic: Number(formData.blood_pressure_diastolic),
    };
  }
  if (formData.pulse_rate) vitals.pulse_rate = Number(formData.pulse_rate);
  if (formData.oxygen_saturation)
    vitals.oxygen_saturation = Number(formData.oxygen_saturation);
  return Object.keys(vitals).length > 0 ? vitals : null;
};
