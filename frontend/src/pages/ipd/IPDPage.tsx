// Responsibility: Main IPD management page displaying ward occupancy and admissions registry

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { IPDStatCards } from './IPDStatCards';
import { IPDBedsGrid } from './IPDBedsGrid';
import { AdmissionFormModal } from './AdmissionFormModal';
import type { Bed } from '@/types';

export const IPDPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const { data: beds = [], isLoading, refetch } = useQuery<Bed[]>({
    queryKey: ['beds', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Bed[]>(`/hospitals/${currentHospital.id}/beds`);
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            IPD Management
          </Heading>
          <Text variant="muted">Manage beds, ward allocation, and patient admissions</Text>
        </Box>
        <Flex gap={2}>
          <Button onClick={() => setShowModal(true)} icon={<Plus className="h-5 w-5" />}>
            New Admission
          </Button>
        </Flex>
      </Flex>

      <IPDStatCards beds={beds} />

      <IPDBedsGrid
        beds={beds}
        isLoading={isLoading}
        onNewAdmission={() => setShowModal(true)}
      />

      {showModal && (
        <AdmissionFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default IPDPage;
