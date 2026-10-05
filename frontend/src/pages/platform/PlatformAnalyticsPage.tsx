// Responsibility: Platform analytics dashboard with charts and insights

import { Box } from "@/components/ui/Box";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PlatformStatCards } from "./PlatformStatCards";
import { RevenueChart } from "./analytics/RevenueChart";
import { HospitalComparisonChart } from "./analytics/HospitalComparisonChart";
import { StaffDistributionChart } from "./analytics/StaffDistributionChart";
import { AnalyticsChartSection } from "./AnalyticsChartSection";
import { usePlatformAnalytics } from "./usePlatformAnalytics";
import { useEnhancedAnalytics } from "./useEnhancedAnalytics";

export default function PlatformAnalyticsPage() {
  const { analytics, isLoading } = usePlatformAnalytics();
  const {
    revenueData,
    isLoadingRevenue,
    hospitalData,
    isLoadingHospital,
    staffData,
    isLoadingStaff,
  } = useEnhancedAnalytics();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="View platform-wide performance metrics and insights"
      />

      <PlatformStatCards analytics={analytics} isLoading={isLoading} />

      <Box className="grid grid-cols-1 gap-6">
        <AnalyticsChartSection
          title="Revenue Trend"
          data={revenueData}
          isLoading={isLoadingRevenue}
          ChartComponent={RevenueChart}
        />
        <AnalyticsChartSection
          title="Hospital Comparison"
          data={hospitalData}
          isLoading={isLoadingHospital}
          ChartComponent={HospitalComparisonChart}
        />
        <AnalyticsChartSection
          title="Staff Distribution"
          data={staffData}
          isLoading={isLoadingStaff}
          ChartComponent={StaffDistributionChart}
        />
      </Box>
    </Box>
  );
}
