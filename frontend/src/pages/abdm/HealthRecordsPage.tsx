// Responsibility: Patient health record linking to ABDM care contexts

import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CareContextList } from "./components/CareContextList";
import { LinkCareContextForm } from "./components/LinkCareContextForm";
import { useHealthRecordsPage } from "./hooks/useHealthRecordsPage";

export default function HealthRecordsPage() {
  const {
    patientId,
    encounters,
    isLoading,
    selectedEncounter,
    setSelectedEncounter,
  } = useHealthRecordsPage();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Health Records Linking"
        description="Link patient clinical encounters to their ABHA for national health record access."
      />
      <CareContextList
        encounters={encounters}
        onSelect={setSelectedEncounter}
        selectedId={selectedEncounter}
      />
      {patientId && (
        <LinkCareContextForm
          patientId={patientId}
          encounterId={selectedEncounter}
        />
      )}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <Text size="sm" className="text-amber-800">
          Note: ABDM linking requires valid credentials and Health Information
          Provider (HIP) registration.
        </Text>
      </Card>
    </Box>
  );
}
