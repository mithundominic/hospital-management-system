// Responsibility: Render status summary metric cards for lab orders

import { Clock, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import type { LabOrder } from '@/types';

export interface LabOrdersStatCardsProps {
  orders: LabOrder[];
}

const statusConfig = [
  { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
  { key: 'in_progress', label: 'In Progress', icon: TestTube, color: 'text-blue-600' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
  { key: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'text-red-600' },
] as const;

export const LabOrdersStatCards = ({ orders }: LabOrdersStatCardsProps) => {
  return (
    <Grid cols={4} gap={4}>
      {statusConfig.map((item) => {
        const Icon = item.icon;
        const count = orders.filter((o) => o.status === item.key).length;
        return (
          <Card key={item.key} className="p-4">
            <Flex align="center" justify="between">
              <Box>
                <Text size="sm" variant="muted">{item.label}</Text>
                <Text size="xl" weight="bold" className="mt-1">{count}</Text>
              </Box>
              <Icon className={`h-8 w-8 ${item.color}`} />
            </Flex>
          </Card>
        );
      })}
    </Grid>
  );
};
