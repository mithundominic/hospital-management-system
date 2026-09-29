// Responsibility: Form to request patient consent for health records access

import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useConsentRequestForm } from "../hooks/useConsentRequestForm";

interface ConsentRequestFormProps {
  patientId: string;
}

export function ConsentRequestForm({ patientId }: ConsentRequestFormProps) {
  const {
    abhaAddress,
    setAbhaAddress,
    purpose,
    setPurpose,
    handleSubmit,
    isSubmitting,
  } = useConsentRequestForm(patientId);

  return (
    <Card className="p-6 mb-6">
      <Heading level={3} className="mb-4">
        Request Patient Consent
      </Heading>
      <Box className="space-y-4 max-w-md">
        <Input
          label="ABHA Address"
          placeholder="user@abdm"
          value={abhaAddress}
          onChange={(e) => setAbhaAddress(e.target.value)}
        />
        <Input
          label="Purpose"
          placeholder="e.g., Treatment Planning"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          Request Consent
        </Button>
      </Box>
    </Card>
  );
}
