// Responsibility: Modal container for creating prescriptions with itemized medications

import { useState } from "react";
import { Plus, Printer } from "lucide-react";
import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { HospitalLetterhead } from "@/components/common/HospitalLetterhead";
import { PrescriptionPrintModal } from "./PrescriptionPrintModal";
import { PrescriptionEncounterSelect } from "./PrescriptionEncounterSelect";
import { PrescriptionItemRow } from "./PrescriptionItemRow";
import { usePrescriptionForm } from "./usePrescriptionForm";
import type { PrescriptionFormModalProps } from "./prescription.types";

export const PrescriptionFormModal = ({
  onClose,
  onSuccess,
  encounterId,
  patientId,
}: PrescriptionFormModalProps) => {
  const [showPreview, setShowPreview] = useState(false);
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

  return (
    <>
      <FormModal
        isOpen={true}
        onClose={onClose}
        title="Create Prescription"
        maxWidth="2xl"
        onSubmit={submit}
        isLoading={loading}
        submitLabel="Save Prescription"
      >
        <Box className="space-y-4">
          <HospitalLetterhead
            documentTitle="PRESCRIPTION (Rx)"
            documentDate={new Date().toLocaleDateString()}
          />

          {!encounterId && (
            <PrescriptionEncounterSelect
              value={selectedEncounter}
              onChange={setSelectedEncounter}
              encounters={encounters}
            />
          )}

          <Flex justify="between" align="center">
            <Text weight="semibold" size="sm">
              Medications
            </Text>
            <Flex gap={2}>
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="h-4 w-4" />}
                onClick={() => setShowPreview(true)}
              >
                Preview Rx
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={addItem}
              >
                Add Medicine
              </Button>
            </Flex>
          </Flex>

          <Box className="space-y-3 max-h-80 overflow-y-auto pr-1">
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
      </FormModal>

      {showPreview && (
        <PrescriptionPrintModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          items={items}
        />
      )}
    </>
  );
};

export default PrescriptionFormModal;
