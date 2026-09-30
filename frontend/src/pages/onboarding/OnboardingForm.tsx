// Responsibility: Unified single-step onboarding form combining account creation and hospital tenant setup

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Box } from "@/components/ui/Box";
import { OnboardingBasicFields } from "./OnboardingBasicFields";
import { OnboardingAddressFields } from "./OnboardingAddressFields";
import { OnboardingAccountFields } from "./OnboardingAccountFields";
import { useOnboardingForm } from "./useOnboardingForm";

export const OnboardingForm = () => {
  const {
    form,
    update,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
    navigateToLogin,
  } = useOnboardingForm();

  return (
    <Card className="p-8 shadow-lg">
      <Heading level={2} className="text-2xl font-bold text-gray-900 mb-2">
        Onboard Hospital
      </Heading>
      <Text variant="muted" size="sm" className="mb-6">
        Create your administrator account and initialize your hospital tenant in
        one step.
      </Text>
      <Form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <OnboardingBasicFields
            name={form.name}
            setName={(v) => update("name", v)}
            regNo={form.regNo}
            setRegNo={(v) => update("regNo", v)}
          />
          <OnboardingAddressFields
            address={form.address}
            setAddress={(v) => update("address", v)}
            city={form.city}
            setCity={(v) => update("city", v)}
            state={form.state}
            setState={(v) => update("state", v)}
            pincode={form.pincode}
            setPincode={(v) => update("pincode", v)}
          />
          <OnboardingAccountFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-3 mt-4"
          >
            Create Account & Onboard Hospital
          </Button>
        </Box>
      </Form>
      <Box className="mt-4 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary-600"
          onClick={navigateToLogin}
        >
          Already have an account? Sign in
        </Button>
      </Box>
    </Card>
  );
};
