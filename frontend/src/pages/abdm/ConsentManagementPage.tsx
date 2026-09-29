// Responsibility: Consent management dashboard with tabs for active consent artifacts and request forms

import type { ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConsentRequestForm } from "./components/ConsentRequestForm";
import { ConsentArtifactsList } from "./components/ConsentArtifactsList";
import { buildConsentTabs, type ConsentTabId } from "./abdm.config";
import { useConsentManagementPage } from "./hooks/useConsentManagementPage";

export default function ConsentManagementPage() {
  const {
    selectedPatient,
    setSelectedPatient,
    patientOptions,
    consentArtifacts,
    consentsLoading,
    activeTab,
    setActiveTab,
  } = useConsentManagementPage();

  const tabs = buildConsentTabs(consentArtifacts.length);

  const tabContent: Record<ConsentTabId, ReactNode> = {
    artifacts: consentsLoading ? (
      <LoadingSpinner size="md" />
    ) : (
      <ConsentArtifactsList artifacts={consentArtifacts} />
    ),
    request: <ConsentRequestForm patientId={selectedPatient} />,
  };

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Consent Management"
        description="Manage patient health data sharing consent and inspect active ABDM artifacts."
      />
      <Card className="p-6">
        <Select
          label="Select Patient"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          options={patientOptions}
        />
      </Card>
      {selectedPatient && (
        <Box className="space-y-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {tabContent[activeTab]}
        </Box>
      )}
    </Box>
  );
}
