// Responsibility: Container page for operational analytics, charts, and inventory stock reports

import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ReportsStatCards } from './ReportsStatCards';
import { ReportsCharts } from './ReportsCharts';
import { ReportsLowStockTable } from './ReportsLowStockTable';
import type { BedOccupancy, RevenueData, LowStockItem } from '@/types';

export default function ReportsPage() {
  const { currentHospital } = useHospital();

  const { data: bedOccupancy } = useQuery<BedOccupancy | null>({
    queryKey: ['reports-bed-occupancy', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return null;
      return api.get(`/hospitals/${currentHospital.id}/reports/bed-occupancy`);
    },
    enabled: !!currentHospital,
  });

  const { data: revenue = [] } = useQuery<RevenueData[]>({
    queryKey: ['reports-revenue', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return api.get(`/hospitals/${currentHospital.id}/reports/daily-revenue`);
    },
    enabled: !!currentHospital,
  });

  const { data: lowStock = [] } = useQuery<LowStockItem[]>({
    queryKey: ['reports-low-stock', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return api.get(`/hospitals/${currentHospital.id}/reports/low-stock`);
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </Heading>
          <Text size="sm" variant="muted">
            View hospital performance metrics and insights
          </Text>
        </Box>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </Flex>

      <ReportsStatCards
        bedOccupancy={bedOccupancy ?? null}
        revenue={revenue}
        lowStock={lowStock}
      />

      <ReportsCharts
        bedOccupancy={bedOccupancy ?? null}
        revenue={revenue}
      />

      <ReportsLowStockTable lowStock={lowStock} />
    </Box>
  );
}
