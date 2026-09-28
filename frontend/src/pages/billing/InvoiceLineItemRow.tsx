// Responsibility: Render single item row in invoice creation form with tax and price inputs

import { Trash2 } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { InvoiceLineItemForm } from "./invoice.types";

export interface InvoiceLineItemRowProps {
  item: InvoiceLineItemForm;
  index: number;
  canRemove: boolean;
  onUpdate: (
    idx: number,
    field: keyof InvoiceLineItemForm,
    val: string,
  ) => void;
  onRemove: (idx: number) => void;
}

const gstOptions = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "12", label: "12%" },
  { value: "18", label: "18%" },
  { value: "28", label: "28%" },
];

export const InvoiceLineItemRow = ({
  item,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: InvoiceLineItemRowProps) => {
  return (
    <Box className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
      <Flex gap={2} align="center">
        <Input
          placeholder="Item Description *"
          value={item.description}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          className="flex-1"
          required
        />
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </Flex>
      <Grid cols={4} gap={2}>
        <Input
          placeholder="Qty"
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdate(index, "quantity", e.target.value)}
          required
        />
        <Input
          placeholder="Unit Price"
          type="number"
          value={item.unit_price}
          onChange={(e) => onUpdate(index, "unit_price", e.target.value)}
          required
        />
        <Input
          placeholder="HSN/SAC"
          value={item.hsn_sac_code}
          onChange={(e) => onUpdate(index, "hsn_sac_code", e.target.value)}
        />
        <Select
          value={item.gst_rate}
          onChange={(e) => onUpdate(index, "gst_rate", e.target.value)}
          options={gstOptions}
        />
      </Grid>
    </Box>
  );
};
