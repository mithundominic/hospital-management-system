// Responsibility: Render the left-hand branding panel with feature overview on login screen

import { Hospital } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

const featureList = [
  "Patient Registration & Medical Records",
  "Appointment Scheduling & Management",
  "Clinical Encounters & Prescriptions",
  "Lab Orders & Results Tracking",
  "Pharmacy & Inventory Management",
  "Billing, Invoicing & Insurance Claims",
] as const;

export const LoginBranding = () => {
  return (
    <Box className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white flex-col justify-between">
      <Box>
        <Flex align="center" gap={3} className="mb-8">
          <Hospital className="h-12 w-12" />
          <Box>
            <Heading level={1} className="text-3xl font-bold text-white">
              HealthCare HMS
            </Heading>
            <Text className="text-primary-100">Hospital Management System</Text>
          </Box>
        </Flex>

        <Box className="space-y-6 mt-12">
          <Heading level={2} className="text-2xl font-semibold text-white mb-4">
            Comprehensive Hospital Management
          </Heading>
          <Box className="space-y-3">
            {featureList.map((item) => (
              <Flex key={item} align="center" gap={2}>
                <Box className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                <Text className="text-primary-100">{item}</Text>
              </Flex>
            ))}
          </Box>
        </Box>
      </Box>

      <Text size="sm" className="text-primary-100">
        © 2026 HealthCare HMS. All rights reserved.
      </Text>
    </Box>
  );
};
