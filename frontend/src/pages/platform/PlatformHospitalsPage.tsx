// Responsibility: Platform admin hospital management page with list and actions

import { Building2 } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PlatformStatCards } from "./PlatformStatCards";
import { HospitalsTable } from "./HospitalsTable";
import { usePlatformHospitals } from "./usePlatformHospitals";
import { usePlatformAnalytics } from "./usePlatformAnalytics";
import { useHospitalActions } from "./useHospitalActions";

export default function PlatformHospitalsPage() {
  const { hospitals, isLoading: hospitalsLoading } = usePlatformHospitals();
  const { analytics, isLoading: analyticsLoading } = usePlatformAnalytics();
  const { activateHospital, deactivateHospital, isActivating, isDeactivating } =
    useHospitalActions();

  if (hospitalsLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Platform Administration"
        description="Manage all hospitals and monitor platform-wide metrics"
      />

      <PlatformStatCards analytics={analytics} isLoading={analyticsLoading} />

      {hospitals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hospitals onboarded"
          description="There are no hospitals in the system yet"
        />
      ) : (
        <HospitalsTable
          hospitals={hospitals}
          onActivate={activateHospital}
          onDeactivate={deactivateHospital}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      )}
    </Box>
  );
}
