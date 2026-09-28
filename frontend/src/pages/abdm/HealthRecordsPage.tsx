// Responsibility: Patient health record linking to ABDM care contexts

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHospital } from "@/contexts/HospitalContext";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CareContextList } from "./components/CareContextList";
import { LinkCareContextForm } from "./components/LinkCareContextForm";
import type { AbdmEncounter } from "./abdm.types";

export default function HealthRecordsPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentHospital } = useHospital();
  const [selectedEncounter, setSelectedEncounter] = useState<string>();

  const { data: encounters = [], isLoading } = useQuery<AbdmEncounter[]>({
    queryKey: ["encounters", currentHospital?.id, patientId],
    enabled: !!currentHospital && !!patientId,
    queryFn: async () => {
      if (!currentHospital || !patientId) return [];
      return api.get<AbdmEncounter[]>(
        `/hospitals/${currentHospital.id}/encounters?patient_id=${patientId}`,
      );
    },
  });

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
          Note: ABDM linking requires valid credentials and Health Information Provider (HIP) registration.
        </Text>
      </Card>
    </Box>
  );
}
