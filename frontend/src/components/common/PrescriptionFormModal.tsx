// Responsibility: Modal container for creating prescriptions with itemized medications

import { useState, lazy, Suspense } from "react";
import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { HospitalLetterhead } from "@/components/common/HospitalLetterhead";
import { PrescriptionEncounterSelect } from "./PrescriptionEncounterSelect";
import { PrescriptionMedicationsSection } from "./PrescriptionMedicationsSection";
import { usePrescriptionForm } from "./usePrescriptionForm";
import type { PrescriptionFormModalProps } from "./prescription.types";

const PrescriptionPrintModal = lazy(() => import("./PrescriptionPrintModal"));

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

          <PrescriptionMedicationsSection
            items={items}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
            onPreview={() => setShowPreview(true)}
          />
        </Box>
      </FormModal>

      {showPreview && (
        <Suspense fallback={null}>
          <PrescriptionPrintModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            items={items}
          />
        </Suspense>
      )}
    </>
  );
};

export default PrescriptionFormModal;
