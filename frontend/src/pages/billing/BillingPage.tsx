// Responsibility: Main billing and invoices page with summary KPI cards and invoices table

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
import { BillingStatCards } from './BillingStatCards';
import { BillingTable } from './BillingTable';
import { InvoiceFormModal } from './InvoiceFormModal';
import type { Invoice } from '@/types';

export const BillingPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const { data: invoices = [], isLoading, refetch } = useQuery<Invoice[]>({
    queryKey: ['invoices', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Invoice[]>(`/hospitals/${currentHospital.id}/invoices`);
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Billing & Invoices
          </Heading>
          <Text variant="muted">Manage patient invoices, taxes, and payments</Text>
        </Box>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-5 w-5" />}>
          New Invoice
        </Button>
      </Flex>

      <BillingStatCards invoices={invoices} />

      <BillingTable
        invoices={invoices}
        isLoading={isLoading}
        onNew={() => setShowModal(true)}
      />

      {showModal && (
        <InvoiceFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default BillingPage;
