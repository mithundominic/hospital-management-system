// Responsibility: Render metric cards summarizing insurance claims by status

import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import type { InsuranceClaim } from '@/types';

export interface InsuranceStatCardsProps {
  claims: InsuranceClaim[];
}

export const InsuranceStatCards = ({ claims }: InsuranceStatCardsProps) => {
  const stats = [
    { label: 'Total Claims', count: claims.length, icon: Shield, color: 'text-blue-600' },
    { label: 'Pending', count: claims.filter((c) => c.status === 'submitted' || c.status === 'under_review').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Approved', count: claims.filter((c) => c.status === 'approved' || c.status === 'settled').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Rejected', count: claims.filter((c) => c.status === 'rejected').length, icon: XCircle, color: 'text-red-600' },
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
