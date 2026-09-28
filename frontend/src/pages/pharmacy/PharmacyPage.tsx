// Responsibility: Main pharmacy inventory management page displaying stock alerts and medicine catalog

import { useQuery } from '@tanstack/react-query';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PharmacyStatCards } from './PharmacyStatCards';
import { PharmacyTable } from './PharmacyTable';
import type { InventoryItem } from '@/types';

export const PharmacyPage = () => {
  const { currentHospital } = useHospital();

  const { data: inventory = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['inventory', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<InventoryItem[]>(`/hospitals/${currentHospital.id}/inventory`);
    },
    enabled: !!currentHospital,
  });

  const lowStock = inventory.filter((item) => (item.quantity_in_stock ?? 0) <= item.reorder_level);
  const totalValue = inventory.reduce(
    (acc, curr) => acc + (curr.quantity_in_stock ?? 0) * curr.unit_price,
    0
  );

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Pharmacy & Inventory
          </Heading>
          <Text variant="muted">Manage medicine stock and dispensing</Text>
        </Box>
        <Flex gap={2}>
          <Button variant="secondary" icon={<Package className="h-5 w-5" />}>
            Stock Transaction
          </Button>
          <Button icon={<Plus className="h-5 w-5" />}>
            Add Item
          </Button>
        </Flex>
      </Flex>

      {lowStock.length > 0 && (
        <Box className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <Flex align="start" gap={3}>
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <Box>
              <Heading level={4} className="font-semibold text-amber-900 text-sm">
                Low Stock Alert
              </Heading>
              <Text size="sm" className="text-amber-800 mt-1">
                {lowStock.length} items are currently below their configured reorder level.
              </Text>
            </Box>
          </Flex>
        </Box>
      )}

      <PharmacyStatCards
        totalItems={inventory.length}
        lowStockCount={lowStock.length}
        totalValue={totalValue}
      />

      <PharmacyTable items={inventory} isLoading={isLoading} />
    </Box>
  );
};

export default PharmacyPage;
