// Responsibility: Main lab orders management page displaying summary metrics and test orders table

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
import { LabOrdersStatCards } from './LabOrdersStatCards';
import { LabOrdersTable } from './LabOrdersTable';
import { LabOrderFormModal } from './LabOrderFormModal';
import type { LabOrder } from '@/types';

export const LabOrdersPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const { data: labOrders = [], isLoading, refetch } = useQuery<LabOrder[]>({
    queryKey: ['lab-orders', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<LabOrder[]>(`/hospitals/${currentHospital.id}/lab-orders`);
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">Lab Orders</Heading>
          <Text variant="muted">Manage laboratory test orders and results</Text>
        </Box>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-5 w-5" />}>
          New Lab Order
        </Button>
      </Flex>

      <LabOrdersStatCards orders={labOrders} />

      <LabOrdersTable
        orders={labOrders}
        isLoading={isLoading}
        onNew={() => setShowModal(true)}
      />

      {showModal && (
        <LabOrderFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default LabOrdersPage;
