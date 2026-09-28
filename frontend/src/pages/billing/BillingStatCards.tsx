// Responsibility: Render invoice status metric cards for billing overview

import { Receipt, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import type { Invoice } from '@/types';

export interface BillingStatCardsProps {
  invoices: Invoice[];
}

export const BillingStatCards = ({ invoices }: BillingStatCardsProps) => {
  const stats = [
    { label: 'Total Invoices', count: invoices.length, icon: Receipt, color: 'text-blue-600' },
    { label: 'Paid', count: invoices.filter((i) => i.status === 'paid').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pending', count: invoices.filter((i) => i.status === 'pending').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Overdue', count: invoices.filter((i) => i.status === 'overdue').length, icon: DollarSign, color: 'text-red-600' },
  ];

  return (
    <Grid cols={4} gap={6}>
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="p-4">
            <Flex align="center" justify="between">
              <Box>
                <Text size="sm" variant="muted">{s.label}</Text>
                <Text size="xl" weight="bold" className="mt-1">{s.count}</Text>
              </Box>
              <Icon className={`h-8 w-8 ${s.color}`} />
            </Flex>
          </Card>
        );
      })}
    </Grid>
  );
};
