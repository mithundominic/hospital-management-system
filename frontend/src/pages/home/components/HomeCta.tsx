// Responsibility: Bottom call-to-action banner for hospital onboarding and registration

import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants";

export const HomeCta = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box className="py-16 sm:py-20 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white">
      <Box className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to Modernize Your Hospital Operations?
        </Heading>
        <Text size="lg" className="mt-4 text-primary-100 max-w-2xl mx-auto">
          Set up your hospital tenant, configure departments, invite doctors and staff, and start managing
          clinical workflows in minutes.
        </Text>

        <Flex justify="center" gap={4} className="mt-8">
          {user ? (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(APP_ROUTES.DASHBOARD)}
              className="shadow-md hover:bg-white text-primary-900 font-semibold text-base px-8 py-3.5"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Go to Hospital Dashboard
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(APP_ROUTES.ONBOARDING)}
              className="shadow-md hover:bg-white text-primary-900 font-semibold text-base px-8 py-3.5"
            >
              Onboard Your Hospital Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </Flex>

        <Flex justify="center" gap={6} wrap className="mt-8 text-primary-200">
          <Flex align="center" gap={2}>
            <CheckCircle2 className="h-4 w-4 text-primary-300" />
            <Text size="xs" className="text-primary-200">No complex installation</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <CheckCircle2 className="h-4 w-4 text-primary-300" />
            <Text size="xs" className="text-primary-200">Pre-configured clinical roles</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <CheckCircle2 className="h-4 w-4 text-primary-300" />
            <Text size="xs" className="text-primary-200">Instant tenant provisioning</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
