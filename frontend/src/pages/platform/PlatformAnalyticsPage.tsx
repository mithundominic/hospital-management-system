// Responsibility: Platform analytics dashboard with charts and insights

import { Box } from "@/components/ui/Box";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PlatformStatCards } from "./PlatformStatCards";
import { usePlatformAnalytics } from "./usePlatformAnalytics";

export default function PlatformAnalyticsPage() {
  const { analytics, isLoading } = usePlatformAnalytics();

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

      {/* Future: Add charts and detailed analytics here */}
    </Box>
  );
}
