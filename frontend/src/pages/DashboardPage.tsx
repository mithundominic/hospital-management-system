// Responsibility: Main dashboard page container rendering overview metrics, charts, and activity feeds

import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonStatCard } from "@/components/common/SkeletonCard";
import { DashboardStatCards } from "./dashboard/DashboardStatCards";
import { DashboardCharts } from "./dashboard/DashboardCharts";
import { DashboardPanels } from "./dashboard/DashboardPanels";
import { defaultStats, type DashboardStats } from "./dashboard/dashboard.data";
import { QUERY_KEYS } from "@/constants";

export const DashboardPage = () => {
  const { currentHospital } = useHospital();

  const { data: stats = defaultStats, isLoading } = useQuery<DashboardStats>({
    queryKey: QUERY_KEYS.hospitals.dashboardStats(currentHospital?.id),
    queryFn: async () => defaultStats,
    enabled: !!currentHospital,
  });

  if (isLoading) {
    return (
      <Box className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Loading dashboard metrics..."
        />
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
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening today."
      />
      <DashboardStatCards stats={stats} />
      <DashboardCharts />
      <DashboardPanels />
    </Box>
  );
};

export default DashboardPage;
