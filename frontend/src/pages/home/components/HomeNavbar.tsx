// Responsibility: Top navigation bar for the homepage with branding and dynamic auth CTAs

import { useNavigate } from "react-router-dom";
import { Hospital, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants";

export const HomeNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Flex align="center" justify="between" className="h-16">
          <Flex align="center" gap={3} className="cursor-pointer" onClick={() => scrollToSection("hero")}>
            <Flex align="center" justify="center" className="h-10 w-10 rounded-xl bg-primary-600 text-white shadow-sm">
              <Hospital className="h-6 w-6" />
            </Flex>
            <Box>
              <Heading level={1} className="text-xl font-bold text-gray-900 leading-tight">
                HealthCare HMS
              </Heading>
              <Text size="xs" variant="muted">
                Hospital Operating System
              </Text>
            </Box>
          </Flex>

          <Flex align="center" gap={6} className="hidden md:flex">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection("modules")}>
              Clinical Modules
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection("features")}>
              Compliance & Security
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection("metrics")}>
              Platform Highlights
            </Button>
          </Flex>

          <Flex align="center" gap={3}>
            {user ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(APP_ROUTES.DASHBOARD)}
                className="font-medium"
              >
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.LOGIN)}
                  className="text-gray-700 font-medium"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.ONBOARDING)}
                  className="font-medium"
                >
                  Onboard Hospital
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
