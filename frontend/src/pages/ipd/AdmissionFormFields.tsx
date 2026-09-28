// Responsibility: Render form input fields and dropdown selectors for patient admission

import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { type AdmissionFormData, admissionTypeOptions } from "./ipd.types";

export interface AdmissionFormFieldsProps {
  formData: AdmissionFormData;
  updateField: <K extends keyof AdmissionFormData>(
    key: K,
    val: AdmissionFormData[K],
  ) => void;
  patientOpts: { value: string; label: string }[];
  bedOpts: { value: string; label: string }[];
  doctorOpts: { value: string; label: string }[];
}

export const AdmissionFormFields = ({
  formData,
  updateField,
  patientOpts,
  bedOpts,
  doctorOpts,
}: AdmissionFormFieldsProps) => (
  <Box className="space-y-4">
    <Select
      label="Patient *"
      value={formData.patient_id}
      onChange={(e) => updateField("patient_id", e.target.value)}
      options={patientOpts}
      required
    />
    <Grid cols={2} gap={4}>
      <Select
        label="Allocated Bed *"
        value={formData.bed_id}
        onChange={(e) => updateField("bed_id", e.target.value)}
        options={bedOpts}
        required
      />
      <Select
        label="Admitting Doctor *"
        value={formData.doctor_id}
        onChange={(e) => updateField("doctor_id", e.target.value)}
        options={doctorOpts}
        required
      />
      <Select
        label="Admission Type"
        value={formData.admission_type}
        onChange={(e) => updateField("admission_type", e.target.value)}
        options={admissionTypeOptions}
      />
      <Input
        label="Admission Date & Time *"
        type="datetime-local"
        value={formData.admission_date}
        onChange={(e) => updateField("admission_date", e.target.value)}
        required
      />
    </Grid>
    <Input
      label="Provisional Diagnosis *"
      placeholder="Primary reason for inpatient admission"
      value={formData.diagnosis}
      onChange={(e) => updateField("diagnosis", e.target.value)}
      required
    />
    <Textarea
      label="Admission Notes & Instructions"
      placeholder="Care protocol or special requirements"
      value={formData.instructions}
      onChange={(e) => updateField("instructions", e.target.value)}
    />
  </Box>
);
