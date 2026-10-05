// Responsibility: Homepage hero section presenting SaaS value proposition and primary CTAs

import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Building2, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { APP_ROUTES } from "@/constants";

export const HomeHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box id="hero" className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-white py-16 lg:py-24">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Flex justify="center" className="mb-6">
          <Badge variant="purple" size="md" className="px-4 py-1 text-sm font-semibold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Next-Gen Multi-Tenant Hospital Management SaaS
          </Badge>
        </Flex>

        <Heading level={1} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto">
          Unified Clinical Care & Modern Hospital Operations
        </Heading>

        <Text size="lg" className="mt-6 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Built specifically for independent hospitals, clinics, and nursing homes. Manage OPD appointments,
          inpatient beds, pharmacy dispensing, lab diagnostics, and GST-compliant invoicing in one secure platform.
        </Text>

        <Flex justify="center" gap={4} className="mt-8" wrap>
          {user ? (
            <>
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate(APP_ROUTES.DASHBOARD)}
                className="shadow-md hover:shadow-lg transition-all"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Go to Hospital Dashboard
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(APP_ROUTES.ONBOARDING)}
                className="flex items-center gap-2"
              >
                <Building2 className="h-5 w-5 text-gray-500" />
                Onboard New Hospital
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate(APP_ROUTES.ONBOARDING)}
                className="shadow-md hover:shadow-lg transition-all"
              >
                Onboard Your Hospital
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(APP_ROUTES.LOGIN)}
                className="flex items-center gap-2"
              >
                <Building2 className="h-5 w-5 text-gray-500" />
                Staff Portal Login
              </Button>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
