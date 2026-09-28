// Responsibility: Patient ABHA verification page and transaction history view

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHospital } from "@/contexts/HospitalContext";
import { Box } from "@/components/ui/Box";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AbhaVerificationForm } from "./components/AbhaVerificationForm";
import { AbhaVerificationList } from "./components/AbhaVerificationList";
import type { LinkRequest } from "./abdm.types";

export default function AbhaVerificationPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentHospital } = useHospital();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const { data: linkRequests = [], isLoading } = useQuery<LinkRequest[]>({
    queryKey: ["abdm-link-requests", currentHospital?.id, patientId],
    enabled: !!currentHospital && !!patientId,
    queryFn: async () => {
      if (!currentHospital || !patientId) return [];
      return api.get<LinkRequest[]>(
        `/hospitals/${currentHospital.id}/patients/${patientId}/abdm/link-requests`,
      );
    },
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="ABHA Verification"
        description="Verify patient identity and track Ayushman Bharat Health Account transactions."
      />
      {patientId && <AbhaVerificationForm patientId={patientId} />}
      <AbhaVerificationList
        requests={linkRequests}
        onSelect={setSelectedRequest}
        selectedId={selectedRequest}
      />
    </Box>
  );
}
