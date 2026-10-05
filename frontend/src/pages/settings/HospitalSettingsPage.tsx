// Responsibility: Top-level page container for managing hospital settings with tabbed sections

import { useState, type ReactNode } from "react";
import { Save } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { HospitalIdentitySection } from "./HospitalIdentitySection";
import { HospitalContactSection } from "./HospitalContactSection";
import { HospitalLegalSection } from "./HospitalLegalSection";
import { SETTINGS_TABS, type SettingsTabId } from "./settings.config";
import { useHospitalSettingsForm } from "./useHospitalSettingsForm";

export const HospitalSettingsPage = () => {
  const { form, update, loading, handleSubmit, currentHospital } =
    useHospitalSettingsForm();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("identity");

  const tabContent: Record<SettingsTabId, ReactNode> = {
    identity: <HospitalIdentitySection form={form} update={update} />,
    contact: <HospitalContactSection form={form} update={update} />,
    legal: <HospitalLegalSection form={form} update={update} />,
  };

  return (
    <Box className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Hospital Branding & Settings"
        description={`Configure official branding, legal registrations, and letterhead details for ${currentHospital?.name || "your hospital"}`}
      />

      <Tabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Form onSubmit={handleSubmit} className="space-y-6">
        {tabContent[activeTab]}

        <Flex justify="end" className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Save className="h-5 w-5" />}
            isLoading={loading}
          >
            Save Hospital Settings
          </Button>
        </Flex>
      </Form>
    </Box>
  );
};

export default HospitalSettingsPage;
