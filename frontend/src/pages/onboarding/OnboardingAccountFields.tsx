// Responsibility: Render email and password fields for unauthenticated hospital onboarding

import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Box } from "@/components/ui/Box";

export interface AccountFieldsProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}

export const OnboardingAccountFields = ({
  email,
  setEmail,
  password,
  setPassword,
}: AccountFieldsProps) => (
  <Box className="space-y-4 pt-2 border-t border-gray-100">
    <Input
      label="Administrator Work Email *"
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      icon={<Mail className="h-5 w-5" />}
      placeholder="admin@yourhospital.com"
    />
    <Input
      label="Account Password *"
      type="password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      icon={<Lock className="h-5 w-5" />}
      placeholder="At least 6 characters"
    />
  </Box>
);
