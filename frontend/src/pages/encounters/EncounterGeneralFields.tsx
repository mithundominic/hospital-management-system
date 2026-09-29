// Responsibility: Form fields for patient, doctor, encounter type, and complaints

import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { encounterTypeOptions } from "./encounter.types";
import type { EncounterFormData } from "./encounter.types";

interface EncounterGeneralFieldsProps {
  formData: EncounterFormData;
  updateField: <K extends keyof EncounterFormData>(
    field: K,
    value: EncounterFormData[K],
  ) => void;
  patientOpts: Array<{ value: string; label: string }>;
  doctorOpts: Array<{ value: string; label: string }>;
}

export const EncounterGeneralFields = ({
  formData,
  updateField,
  patientOpts,
  doctorOpts,
}: EncounterGeneralFieldsProps) => (
  <>
    <Grid cols={3} gap={3}>
      <Select
        label="Patient *"
        value={formData.patient_id}
        onChange={(e) => updateField("patient_id", e.target.value)}
        options={patientOpts}
        required
      />
      <Select
        label="Doctor *"
        value={formData.doctor_id}
        onChange={(e) => updateField("doctor_id", e.target.value)}
        options={doctorOpts}
        required
      />
      <Select
        label="Encounter Type"
        value={formData.encounter_type}
        onChange={(e) =>
          updateField(
            "encounter_type",
            e.target.value as "opd" | "emergency" | "ipd",
          )
        }
        options={encounterTypeOptions}
      />
    </Grid>
    <Input
      label="Chief Complaint *"
      placeholder="e.g. High fever with cough"
      value={formData.chief_complaint}
      onChange={(e) => updateField("chief_complaint", e.target.value)}
      required
    />
    <Input
      label="Diagnosis"
      placeholder="Clinical diagnosis"
      value={formData.diagnosis}
      onChange={(e) => updateField("diagnosis", e.target.value)}
    />
  </>
);
