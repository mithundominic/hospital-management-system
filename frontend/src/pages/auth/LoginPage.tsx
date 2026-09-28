// Responsibility: Top-level page container assembling login branding and login form

import { Hospital } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { LoginBranding } from "./LoginBranding";
import { LoginForm } from "./LoginForm";

export const LoginPage = () => {
  return (
    <Flex className="min-h-screen">
      <LoginBranding />
      <Flex align="center" justify="center" className="flex-1 p-8">
        <Box className="w-full max-w-md">
          <Box className="text-center mb-8 lg:hidden">
            <Hospital className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <Heading level={1} className="text-2xl font-bold text-gray-900">
              HealthCare HMS
            </Heading>
          </Box>
          <LoginForm />
        </Box>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
