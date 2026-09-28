// Responsibility: Main insurance claims dashboard page displaying status metrics and claims registry table

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { InsuranceStatCards } from './InsuranceStatCards';
import { InsuranceClaimsTable } from './InsuranceClaimsTable';
import type { InsuranceClaim } from '@/types';

export const InsurancePage = () => {
  const { currentHospital } = useHospital();

  const { data: claims = [], isLoading } = useQuery<InsuranceClaim[]>({
    queryKey: ['insurance-claims', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<InsuranceClaim[]>(`/hospitals/${currentHospital.id}/insurance-claims`);
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Insurance Claims
          </Heading>
          <Text variant="muted">Manage insurance policies and claim processing</Text>
        </Box>
        <Button icon={<Plus className="h-5 w-5" />}>
          New Claim
        </Button>
      </Flex>

      <InsuranceStatCards claims={claims} />
      <InsuranceClaimsTable claims={claims} isLoading={isLoading} />
    </Box>
  );
};

export default InsurancePage;
