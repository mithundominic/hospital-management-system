// Responsibility: Render individual prescription medicine row with inputs and remove action

import { Trash2 } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { PrescriptionItem } from "./prescription.types";

export interface PrescriptionItemRowProps {
  item: PrescriptionItem;
  index: number;
  canRemove: boolean;
  onUpdate: (
    index: number,
    field: keyof PrescriptionItem,
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}

const routeOptions = [
  { value: "oral", label: "Oral" },
  { value: "iv", label: "IV" },
  { value: "im", label: "IM" },
  { value: "topical", label: "Topical" },
  { value: "sublingual", label: "Sublingual" },
];

export const PrescriptionItemRow = ({
  item,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: PrescriptionItemRowProps) => {
  return (
    <Box className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
      <Flex justify="between" align="center">
        <Input
          placeholder="Medicine Name *"
          value={item.medicine_name}
          onChange={(e) => onUpdate(index, "medicine_name", e.target.value)}
          className="flex-1"
        />
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </Flex>
      <Grid cols={3} gap={3}>
        <Input
          placeholder="Dosage (e.g., 500mg)"
          value={item.dosage}
          onChange={(e) => onUpdate(index, "dosage", e.target.value)}
        />
        <Input
          placeholder="Frequency (e.g., TID)"
          value={item.frequency}
          onChange={(e) => onUpdate(index, "frequency", e.target.value)}
        />
        <Input
          placeholder="Duration (days)"
          value={item.duration_days}
          onChange={(e) => onUpdate(index, "duration_days", e.target.value)}
        />
      </Grid>
      <Grid cols={2} gap={3}>
        <Select
          value={item.route}
          onChange={(e) => onUpdate(index, "route", e.target.value)}
          options={routeOptions}
        />
        <Input
          placeholder="Special Instructions"
          value={item.instructions}
          onChange={(e) => onUpdate(index, "instructions", e.target.value)}
        />
      </Grid>
    </Box>
  );
};
