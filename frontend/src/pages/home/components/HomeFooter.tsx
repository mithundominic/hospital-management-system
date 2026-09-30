// Responsibility: Footer displaying product branding, copyright, and platform information

import { useNavigate } from "react-router-dom";
import { Hospital, Shield } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants";

export const HomeFooter = () => {
  const navigate = useNavigate();

  return (
    <Box className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Flex justify="between" align="start" wrap gap={8} className="pb-8 border-b border-gray-800">
          <Box className="max-w-sm">
            <Flex align="center" gap={3} className="mb-3">
              <Flex align="center" justify="center" className="h-8 w-8 rounded-lg bg-primary-600 text-white">
                <Hospital className="h-5 w-5" />
              </Flex>
              <Heading level={2} className="text-lg font-bold text-white">
                HealthCare HMS
              </Heading>
            </Flex>
            <Text size="sm" className="text-gray-400 leading-relaxed">
              Comprehensive multi-tenant hospital management SaaS empowering independent healthcare providers
              across India with unified clinical workflows.
            </Text>
          </Box>

          <Flex gap={8} wrap>
            <Box>
              <Text weight="semibold" size="sm" className="text-white mb-3">
                Quick Access
              </Text>
              <Box className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.LOGIN)}
                  className="text-gray-400 hover:text-white p-0 h-auto justify-start"
                >
                  Staff Portal Login
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.ONBOARDING)}
                  className="text-gray-400 hover:text-white p-0 h-auto justify-start"
                >
                  Onboard Hospital
                </Button>
              </Box>
            </Box>

            <Box className="max-w-xs">
              <Text weight="semibold" size="sm" className="text-white mb-3">
                Security & Compliance
              </Text>
              <Flex align="center" gap={2} className="text-gray-400 text-xs">
                <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                <Text size="xs" className="text-gray-400">
                  DPDP Act (2023) & ABDM digital health standards aligned
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>

        <Flex justify="between" align="center" wrap gap={4} className="pt-8 text-xs text-gray-500">
          <Text size="xs" className="text-gray-500">
            © 2026 HealthCare HMS SaaS. All rights reserved.
          </Text>
          <Text size="xs" className="text-gray-500">
            PostgreSQL Row-Level Security • Insert-Only Ledgers
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
