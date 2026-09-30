// Responsibility: Render left-hand branding and benefits panel for hospital onboarding

import { Building2, ShieldCheck, Zap, Stethoscope } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

const onboardingHighlights = [
  {
    icon: Building2,
    title: "Dedicated Tenant Workspace",
    desc: "Complete data isolation for clinical, pharmacy, and billing records",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise RBAC & Compliance",
    desc: "Built-in roles for Doctors, Nurses, Lab Techs, and Billing Clerks",
  },
  {
    icon: Stethoscope,
    title: "Complete Clinical Care",
    desc: "OPD/IPD management, electronic prescriptions, and lab workflows",
  },
  {
    icon: Zap,
    title: "Instant Tenant Provisioning",
    desc: "Automated administrator setup ready in seconds with zero delay",
  },
] as const;

export const OnboardingBranding = () => {
  return (
    <Box className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white flex-col justify-between">
      <Box>
        <Flex align="center" gap={3} className="mb-8">
          <Building2 className="h-12 w-12 text-primary-200" />
          <Box>
            <Heading level={1} className="text-3xl font-bold text-white">
              HealthCare HMS
            </Heading>
            <Text className="text-primary-100">Hospital SaaS Platform</Text>
          </Box>
        </Flex>

        <Box className="mt-8 space-y-6">
          <Heading level={2} className="text-2xl font-semibold text-white mb-2">
            Register Your Hospital
          </Heading>
          <Text className="text-primary-100 text-sm leading-relaxed mb-6">
            Get your healthcare facility onboarded to begin managing patients,
            appointments, staff shifts, and medical billing.
          </Text>

          <Box className="space-y-4">
            {onboardingHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <Flex key={item.title} gap={3} align="start">
                  <Box className="mt-1 p-1.5 rounded-lg bg-primary-700/60 text-white shrink-0">
                    <Icon className="h-4 w-4" />
                  </Box>
                  <Box>
                    <Text className="font-medium text-white text-sm">
                      {item.title}
                    </Text>
                    <Text size="xs" className="text-primary-200">
                      {item.desc}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Text size="sm" className="text-primary-200">
        © 2026 HealthCare HMS. Multi-Tenant Enterprise Health System.
      </Text>
    </Box>
  );
};
