// Responsibility: Render the user login form with email/password and demo hints

import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { APP_ROUTES } from "@/constants";
import { useLoginForm } from "./useLoginForm";

export const LoginForm = () => {
  const { email, setEmail, password, setPassword, loading, handleSubmit } =
    useLoginForm();
  const navigate = useNavigate();

  return (
    <Card className="p-8 shadow-lg">
      <Heading level={2} className="text-2xl font-bold text-gray-900 mb-6">
        Sign in to your account
      </Heading>

      <Form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            placeholder="admin@hospital.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            placeholder="••••••••"
          />

          <Button type="submit" isLoading={loading} className="w-full py-3">
            Sign in
          </Button>
        </Box>
      </Form>

      <Box className="mt-4 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary-600 hover:text-primary-700"
          onClick={() => navigate(APP_ROUTES.ONBOARDING)}
        >
          New hospital? Onboard here
        </Button>
      </Box>

      <Box className="mt-4 text-center">
        <Text size="sm" variant="muted">
          Demo Credentials:
        </Text>
        <Text size="xs" variant="muted" className="mt-1">
          Email: admin@hospital.com
        </Text>
        <Text size="xs" variant="muted">
          Password: password123
        </Text>
      </Box>
    </Card>
  );
};
