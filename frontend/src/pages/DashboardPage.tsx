// Responsibility: Main dashboard page container rendering overview metrics, charts, and activity feeds

import { useQuery } from '@tanstack/react-query';
import { useHospital } from '@/contexts/HospitalContext';
import { Box } from '@/components/ui/Box';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { SkeletonStatCard } from '@/components/common/SkeletonCard';
import { Grid } from '@/components/ui/Grid';
import { DashboardStatCards } from './dashboard/DashboardStatCards';
import { DashboardCharts } from './dashboard/DashboardCharts';
import { DashboardPanels } from './dashboard/DashboardPanels';
import { defaultStats, type DashboardStats } from './dashboard/dashboard.data';

export const DashboardPage = () => {
  const { currentHospital } = useHospital();

  const { data: stats = defaultStats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', currentHospital?.id],
    queryFn: async () => defaultStats,
    enabled: !!currentHospital,
  });

  if (isLoading) {
    return (
      <Box className="space-y-6">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">Dashboard</Heading>
          <Text variant="muted">Loading dashboard metrics...</Text>
        </Box>
        <Grid cols={4} gap={6}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonStatCard key={idx} />
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Box>
        <Heading level={1} className="text-2xl font-bold text-gray-900">
          Dashboard
        </Heading>
        <Text variant="muted">
          Welcome back! Here's what's happening today.
        </Text>
      </Box>

      <DashboardStatCards stats={stats} />
      <DashboardCharts />
      <DashboardPanels />
    </Box>
  );
};

export default DashboardPage;
