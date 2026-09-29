// Responsibility: Form to link patient care context to ABHA address

import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLinkCareContextForm } from "../hooks/useLinkCareContextForm";

interface LinkCareContextFormProps {
  patientId: string;
  encounterId?: string;
}

export function LinkCareContextForm({
  patientId,
  encounterId,
}: LinkCareContextFormProps) {
  const {
    abhaAddress,
    setAbhaAddress,
    careContextRef,
    setCareContextRef,
    handleSubmit,
    isSubmitting,
  } = useLinkCareContextForm(patientId);

  return (
    <Card className="p-6 mb-6">
      <Heading level={3} className="mb-4">
        Link Care Context
      </Heading>
      {encounterId && (
        <Text size="sm" variant="muted" className="mb-4">
          Selected Encounter ID: {encounterId}
        </Text>
      )}
      <Box className="space-y-4 max-w-md">
        <Input
          label="ABHA Address"
          placeholder="user@abdm"
          value={abhaAddress}
          onChange={(e) => setAbhaAddress(e.target.value)}
        />
        <Input
          label="Care Context Reference"
          placeholder="e.g., VISIT-2026-001"
          value={careContextRef}
          onChange={(e) => setCareContextRef(e.target.value)}
        />
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          Link to ABDM
        </Button>
      </Box>
    </Card>
  );
}
