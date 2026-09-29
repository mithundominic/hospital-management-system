// Responsibility: Patient ABHA verification page with tabs for verification form and transaction history

import type { ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AbhaVerificationForm } from "./components/AbhaVerificationForm";
import { AbhaVerificationList } from "./components/AbhaVerificationList";
import { buildAbhaTabs, type AbhaTabId } from "./abdm.config";
import { useAbhaVerificationPage } from "./hooks/useAbhaVerificationPage";

export default function AbhaVerificationPage() {
  const {
    patientId,
    linkRequests,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    activeTab,
    setActiveTab,
  } = useAbhaVerificationPage();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  const tabs = buildAbhaTabs(linkRequests.length);

  const tabContent: Record<AbhaTabId, ReactNode> = {
    verify: patientId ? <AbhaVerificationForm patientId={patientId} /> : null,
    history: (
      <AbhaVerificationList
        requests={linkRequests}
        onSelect={setSelectedRequest}
        selectedId={selectedRequest}
      />
    ),
  };

  return (
    <Box className="space-y-6">
      <PageHeader
        title="ABHA Verification"
        description="Verify patient identity and track Ayushman Bharat Health Account transactions."
      />
      {patientId ? (
        <Box className="space-y-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {tabContent[activeTab]}
        </Box>
      ) : (
        <AbhaVerificationList
          requests={linkRequests}
          onSelect={setSelectedRequest}
          selectedId={selectedRequest}
        />
      )}
    </Box>
  );
}
