// Responsibility: Modal container for creating prescriptions with itemized medications

import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ModalFooter } from "@/components/common/ModalFooter";
import { PrescriptionItemRow } from "./PrescriptionItemRow";
import { usePrescriptionForm } from "./usePrescriptionForm";
import type { PrescriptionFormModalProps } from "./prescription.types";

export const PrescriptionFormModal = ({
  onClose,
  onSuccess,
  encounterId,
  patientId,
}: PrescriptionFormModalProps) => {
  const {
    loading,
    selectedEncounter,
    setSelectedEncounter,
    items,
    encounters,
    addItem,
    removeItem,
    updateItem,
    submit,
  } = usePrescriptionForm(onClose, onSuccess, encounterId, patientId);

  const encounterOptions = [
    { value: "", label: "Select Encounter" },
    ...encounters.map((enc) => ({
      value: enc.id,
      label: `${enc.chief_complaint || "General Visit"} (${enc.created_at ? new Date(enc.created_at).toLocaleDateString() : "N/A"})`,
    })),
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create Prescription"
      maxWidth="2xl"
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={submit}
          isLoading={loading}
          submitLabel="Create Prescription"
        />
      }
    >
      <Box className="space-y-4">
        {!encounterId && (
          <Select
            label="Associated Encounter *"
            value={selectedEncounter}
            onChange={(e) => setSelectedEncounter(e.target.value)}
            options={encounterOptions}
          />
        )}

        <Flex justify="between" align="center">
          <Text weight="semibold" size="sm">
            Medications
          </Text>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={addItem}
          >
            Add Medicine
          </Button>
        </Flex>

        <Box className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {items.map((item, index) => (
            <PrescriptionItemRow
              key={index}
              item={item}
              index={index}
              canRemove={items.length > 1}
              onUpdate={updateItem}
              onRemove={removeItem}
            />
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default PrescriptionFormModal;
