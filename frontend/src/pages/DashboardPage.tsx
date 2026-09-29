// Responsibility: Main dashboard page container rendering overview metrics, tabs, and selected panel

import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonStatCard } from "@/components/common/SkeletonCard";
import { DashboardStatCards } from "./dashboard/DashboardStatCards";
import {
  DASHBOARD_TABS,
  DASHBOARD_TAB_COMPONENTS,
} from "./dashboard/dashboard.config";
import { useDashboardPage } from "./dashboard/useDashboardPage";

export const DashboardPage = () => {
  const { stats, isLoading, activeTab, setActiveTab } = useDashboardPage();

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

  const ActiveContent = DASHBOARD_TAB_COMPONENTS[activeTab];

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening today."
      />
      <DashboardStatCards stats={stats} />
      <Box className="space-y-4">
        <Tabs
          tabs={DASHBOARD_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <ActiveContent />
      </Box>
    </Box>
  );
};

export default DashboardPage;
