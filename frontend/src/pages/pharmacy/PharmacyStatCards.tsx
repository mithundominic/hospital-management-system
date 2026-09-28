// Responsibility: Render inventory summary metric cards for total items and stock health

import { Pill, TrendingDown, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export interface PharmacyStatCardsProps {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
}

export const PharmacyStatCards = ({
  totalItems,
  lowStockCount,
  totalValue,
}: PharmacyStatCardsProps) => {
  return (
    <Grid cols={3} gap={6}>
      <Card className="p-6">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Total Items</Text>
            <Text size="xl" weight="bold" className="mt-1">{totalItems}</Text>
          </Box>
          <Pill className="h-8 w-8 text-blue-600" />
        </Flex>
      </Card>
      <Card className="p-6">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Low Stock Items</Text>
            <Text size="xl" weight="bold" className="mt-1 text-red-600">{lowStockCount}</Text>
          </Box>
          <TrendingDown className="h-8 w-8 text-red-600" />
        </Flex>
      </Card>
      <Card className="p-6">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Estimated Value</Text>
            <Text size="xl" weight="bold" className="mt-1">₹{totalValue.toLocaleString('en-IN')}</Text>
          </Box>
          <Package className="h-8 w-8 text-green-600" />
        </Flex>
      </Card>
    </Grid>
  );
};
