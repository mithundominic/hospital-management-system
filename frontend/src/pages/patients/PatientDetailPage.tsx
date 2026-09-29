// Responsibility: Detailed profile page for single patient showing demographics, quick actions, and tabbed clinical history

import type { ReactNode } from "react";
import { FileText, TestTube, Pill } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Text } from "@/components/ui/Text";
import { Tabs } from "@/components/ui/Tabs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PatientDetailHeader } from "./PatientDetailHeader";
import { PatientClinicalSectionCard } from "./PatientClinicalSectionCard";
import { PatientQuickActionsCard } from "./PatientQuickActionsCard";
import { PATIENT_DETAIL_TABS, type PatientDetailTabId } from "./patient.config";
import { usePatientDetailPage } from "./usePatientDetailPage";

export const PatientDetailPage = () => {
  const { patient, isLoading, activeTab, setActiveTab } =
    usePatientDetailPage();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!patient) {
    return (
      <Box className="text-center py-12">
        <Text variant="muted">Patient not found</Text>
      </Box>
    );
  }

  const tabContent: Record<PatientDetailTabId, ReactNode> = {
    encounters: (
      <PatientClinicalSectionCard
        icon={FileText}
        title="Recent Encounters"
        emptyText="No encounters recorded yet"
      />
    ),
    labs: (
      <PatientClinicalSectionCard
        icon={TestTube}
        title="Lab Results"
        emptyText="No lab results available"
      />
    ),
    prescriptions: (
      <PatientClinicalSectionCard
        icon={Pill}
        title="Prescriptions"
        emptyText="No active prescriptions"
      />
    ),
  };

  return (
    <Box className="space-y-6">
      <Grid cols={3} gap={6}>
        <Box className="lg:col-span-2">
          <PatientDetailHeader patient={patient} />
        </Box>
        <Box className="lg:col-span-1">
          <PatientQuickActionsCard />
        </Box>
      </Grid>

      <Box className="space-y-4">
        <Tabs
          tabs={PATIENT_DETAIL_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {tabContent[activeTab]}
      </Box>
    </Box>
  );
};

export default PatientDetailPage;
