// Responsibility: Render inpatient bed occupancy metrics and capacity summary

import { Bed, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import type { Bed as BedType } from '@/types';

export interface IPDStatCardsProps {
  beds: BedType[];
}

export const IPDStatCards = ({ beds }: IPDStatCardsProps) => {
  const total = beds.length;
  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const available = beds.filter((b) => b.status === 'available').length;
  const maintenance = beds.filter((b) => b.status === 'maintenance').length;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <Grid cols={4} gap={6}>
      <Card className="p-4">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Total Beds</Text>
            <Text size="xl" weight="bold" className="mt-1">{total}</Text>
          </Box>
          <Bed className="h-8 w-8 text-blue-600" />
        </Flex>
      </Card>
      <Card className="p-4">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Occupied</Text>
            <Text size="xl" weight="bold" className="mt-1 text-red-600">{occupied}</Text>
            <Text size="xs" variant="caption">{occupancyRate}% occupancy</Text>
          </Box>
          <User className="h-8 w-8 text-red-600" />
        </Flex>
      </Card>
      <Card className="p-4">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Available</Text>
            <Text size="xl" weight="bold" className="mt-1 text-green-600">{available}</Text>
          </Box>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </Flex>
      </Card>
      <Card className="p-4">
        <Flex align="center" justify="between">
          <Box>
            <Text size="sm" variant="muted">Maintenance</Text>
            <Text size="xl" weight="bold" className="mt-1 text-yellow-600">{maintenance}</Text>
          </Box>
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </Flex>
      </Card>
    </Grid>
  );
};
