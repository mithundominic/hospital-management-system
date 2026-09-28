// Responsibility: Render operational KPI summary cards for occupancy, revenue, and stock alerts

import { Bed, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import type { BedOccupancy, RevenueData, LowStockItem } from '@/types';

export interface ReportsStatCardsProps {
  bedOccupancy: BedOccupancy | null;
  revenue: RevenueData[];
  lowStock: LowStockItem[];
}

export const ReportsStatCards = ({ bedOccupancy, revenue, lowStock }: ReportsStatCardsProps) => {
  const occRate = bedOccupancy?.total_beds
    ? Math.round((bedOccupancy.occupied_beds / bedOccupancy.total_beds) * 100)
    : 0;
  const todayRev = revenue[0]?.total_amount || 0;

  return (
    <Grid cols={3} gap={6}>
      <Card className="p-6">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Bed Occupancy</Text>
            <Text size="xl" weight="bold" className="mt-1">{occRate}%</Text>
            <Text size="xs" variant="caption" className="mt-1">
              {bedOccupancy?.occupied_beds || 0} / {bedOccupancy?.total_beds || 0} beds
            </Text>
          </Box>
          <Bed className="h-8 w-8 text-purple-600" />
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Today's Revenue</Text>
            <Text size="xl" weight="bold" className="mt-1">₹{todayRev.toLocaleString('en-IN')}</Text>
            <Flex align="center" gap={1} className="mt-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <Text size="xs" className="text-green-600">+12% from yesterday</Text>
            </Flex>
          </Box>
          <DollarSign className="h-8 w-8 text-green-600" />
        </Flex>
      </Card>

      <Card className="p-6">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Low Stock Items</Text>
            <Text size="xl" weight="bold" className="mt-1 text-amber-600">{lowStock.length}</Text>
            <Text size="xs" variant="caption" className="mt-1">Requires immediate attention</Text>
          </Box>
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </Flex>
      </Card>
    </Grid>
  );
};
