// Responsibility: Modal container for recording clinical encounters, diagnoses, and vitals

import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Textarea } from "@/components/ui/Textarea";
import { EncounterVitalsSection } from "./EncounterVitalsSection";
import { EncounterGeneralFields } from "./EncounterGeneralFields";
import { useEncounterForm } from "./useEncounterForm";
import type { EncounterFormModalProps } from "./encounter.types";

export const EncounterFormModal = ({
  onClose,
  onSuccess,
  encounter,
}: EncounterFormModalProps) => {
  const { loading, formData, updateField, patients, doctors, handleSubmit } =
    useEncounterForm(onClose, onSuccess, encounter);

  const patientOpts = [
    { value: "", label: "Select Patient" },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  const doctorOpts = [
    { value: "", label: "Select Doctor" },
    ...doctors.map((d) => ({
      value: d.id,
      label: `Dr. (${d.specialization || "General"})`,
    })),
  ];

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title={encounter ? "Edit Encounter" : "New Clinical Encounter"}
      maxWidth="2xl"
      onSubmit={handleSubmit}
      submitLabel={encounter ? "Update Encounter" : "Save Encounter"}
      isLoading={loading}
    >
      <Box className="space-y-4">
        <EncounterGeneralFields
          formData={formData}
          updateField={updateField}
          patientOpts={patientOpts}
          doctorOpts={doctorOpts}
        />
        <EncounterVitalsSection formData={formData} onUpdate={updateField} />
        <Textarea
          label="Clinical Notes"
          rows={2}
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </Box>
    </FormModal>
  );
};

export default EncounterFormModal;
