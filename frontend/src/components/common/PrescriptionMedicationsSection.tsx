// Responsibility: Medication item list and controls for prescription form modal

import { Plus, Printer } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { PrescriptionItemRow } from "./PrescriptionItemRow";
import type { PrescriptionItem } from "./prescription.types";

interface PrescriptionMedicationsSectionProps {
  items: PrescriptionItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (
    index: number,
    field: keyof PrescriptionItem,
    value: string,
  ) => void;
  onPreview: () => void;
}

export const PrescriptionMedicationsSection = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onPreview,
}: PrescriptionMedicationsSectionProps) => {
  return (
    <>
      <Flex justify="between" align="center">
        <Text weight="semibold" size="sm">
          Medications
        </Text>
        <Flex gap={2}>
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="h-4 w-4" />}
            onClick={onPreview}
          >
            Preview Rx
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={onAddItem}
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
            onUpdate={onUpdateItem}
            onRemove={onRemoveItem}
          />
        ))}
      </Box>
    </>
  );
};
