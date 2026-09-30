// Responsibility: Top-level page container assembling onboarding branding and onboarding form

import { Building2 } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { OnboardingBranding } from "./OnboardingBranding";
import { OnboardingForm } from "./OnboardingForm";

export const OnboardingPage = () => {
  return (
    <Flex className="min-h-screen bg-gray-50">
      <OnboardingBranding />
      <Flex
        align="center"
        justify="center"
        className="flex-1 p-6 lg:p-12 overflow-y-auto"
      >
        <Box className="w-full max-w-xl py-6">
          <Box className="text-center mb-6 lg:hidden">
            <Building2 className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <Heading level={1} className="text-2xl font-bold text-gray-900">
              HealthCare HMS
            </Heading>
          </Box>
          <OnboardingForm />
        </Box>
      </Flex>
    </Flex>
  );
};

export default OnboardingPage;
