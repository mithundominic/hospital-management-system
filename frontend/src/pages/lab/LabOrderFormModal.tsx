// Responsibility: Modal container for creating and editing diagnostic laboratory test orders

import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { sampleTypeOptions, urgencyOptions, testNameOptions } from "./lab.data";
import { useLabOrderForm } from "./useLabOrderForm";
import type { LabOrder } from "@/types";

export interface LabOrderFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  labOrder?: LabOrder | null;
}

export const LabOrderFormModal = ({
  onClose,
  onSuccess,
  labOrder,
}: LabOrderFormModalProps) => {
  const { loading, formData, updateField, encounterOptions, handleSubmit } =
    useLabOrderForm(onClose, onSuccess, labOrder);

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title={labOrder ? "Edit Lab Order" : "Create Lab Order"}
      maxWidth="xl"
      onSubmit={handleSubmit}
      isLoading={loading}
      submitLabel={labOrder ? "Update Order" : "Create Order"}
    >
      <Box className="space-y-4">
        <Select
          label="Encounter *"
          value={formData.encounter_id}
          onChange={(e) => updateField("encounter_id", e.target.value)}
          options={encounterOptions}
          required
        />
        <Select
          label="Common Diagnostic Tests"
          value={formData.test_name}
          onChange={(e) => updateField("test_name", e.target.value)}
          options={testNameOptions}
        />
        <Input
          label="Test Name *"
          placeholder="e.g. Complete Blood Count (CBC)"
          value={formData.test_name}
          onChange={(e) => updateField("test_name", e.target.value)}
          required
        />
        <Grid cols={2} gap={4}>
          <Select
            label="Sample Type"
            value={formData.sample_type}
            onChange={(e) => updateField("sample_type", e.target.value)}
            options={sampleTypeOptions}
          />
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              updateField(
                "priority",
                e.target.value as "routine" | "urgent" | "stat",
              )
            }
            options={urgencyOptions}
          />
        </Grid>
        <Textarea
          label="Special Instructions"
          value={formData.instructions}
          onChange={(e) => updateField("instructions", e.target.value)}
          placeholder="Fasting instructions, clinical indications, etc."
        />
      </Box>
    </FormModal>
  );
};

export default LabOrderFormModal;
