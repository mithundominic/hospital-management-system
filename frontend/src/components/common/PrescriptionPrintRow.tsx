// Responsibility: Render single medication item in printable prescription layout

import { Pill } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import type { PrescriptionItem } from "./prescription.types";

interface PrescriptionPrintRowProps {
  item: PrescriptionItem;
}

export const PrescriptionPrintRow = ({ item }: PrescriptionPrintRowProps) => (
  <Flex justify="between" align="center" className="p-3 border-t border-gray-200 text-sm">
    <Flex align="center" gap={2}>
      <Pill className="h-4 w-4 text-primary-600 shrink-0" />
      <Box>
        <Text size="sm" weight="semibold">{item.medicine_name}</Text>
        {item.instructions && (
          <Text size="xs" variant="muted">{item.instructions}</Text>
        )}
      </Box>
    </Flex>
    <Text size="sm" weight="medium">{item.dosage} • {item.frequency}</Text>
    <Text size="sm" className="text-gray-600">
      {item.duration_days ? `${item.duration_days} days` : "As directed"}
    </Text>
  </Flex>
);
