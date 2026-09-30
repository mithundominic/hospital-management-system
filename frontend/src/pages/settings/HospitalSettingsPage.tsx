// Responsibility: Top-level page container for managing hospital tenant branding, contact, and statutory settings

import { Save } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { HospitalIdentitySection } from "./HospitalIdentitySection";
import { HospitalContactSection } from "./HospitalContactSection";
import { HospitalLegalSection } from "./HospitalLegalSection";
import { useHospitalSettingsForm } from "./useHospitalSettingsForm";

export const HospitalSettingsPage = () => {
  const { form, update, loading, handleSubmit, currentHospital } =
    useHospitalSettingsForm();

  return (
    <Box className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Hospital Branding & Settings"
        description={`Configure official branding, legal registrations, and letterhead details for ${currentHospital?.name || "your hospital"}`}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <HospitalIdentitySection form={form} update={update} />
        <HospitalContactSection form={form} update={update} />
        <HospitalLegalSection form={form} update={update} />

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
      </form>
    </Box>
  );
};

export default HospitalSettingsPage;
