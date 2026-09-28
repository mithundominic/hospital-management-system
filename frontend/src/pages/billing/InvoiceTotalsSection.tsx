// Responsibility: Render calculation summary displaying subtotal, taxes, and grand total

import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Text } from '@/components/ui/Text';
import type { InvoiceTotals } from './invoice.types';

export interface InvoiceTotalsSectionProps {
  totals: InvoiceTotals;
}

export const InvoiceTotalsSection = ({ totals }: InvoiceTotalsSectionProps) => {
  return (
    <Box className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
      <Flex justify="between">
        <Text size="sm" variant="muted">Subtotal:</Text>
        <Text size="sm" weight="medium">₹{totals.subtotal.toFixed(2)}</Text>
      </Flex>
      <Flex justify="between">
        <Text size="sm" variant="muted">CGST:</Text>
        <Text size="sm" weight="medium">₹{totals.cgst.toFixed(2)}</Text>
      </Flex>
      <Flex justify="between">
        <Text size="sm" variant="muted">SGST:</Text>
        <Text size="sm" weight="medium">₹{totals.sgst.toFixed(2)}</Text>
      </Flex>
      <Flex justify="between" className="pt-2 border-t border-gray-200">
        <Text weight="bold" size="base">Grand Total:</Text>
        <Text weight="bold" size="base" className="text-primary-600">
          ₹{totals.total.toFixed(2)}
        </Text>
      </Flex>
    </Box>
  );
};
