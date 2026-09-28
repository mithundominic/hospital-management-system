// Responsibility: Form to link patient care context to ABHA address

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHospital } from "@/contexts/HospitalContext";
import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface LinkCareContextFormProps {
  patientId: string;
  encounterId?: string;
}

export function LinkCareContextForm({
  patientId,
  encounterId,
}: LinkCareContextFormProps) {
  const { currentHospital } = useHospital();
  const [abhaAddress, setAbhaAddress] = useState("");
  const [careContextRef, setCareContextRef] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      abha_address: string;
      care_context_reference: string;
    }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return api.post(
        `/hospitals/${currentHospital.id}/patients/${patientId}/abdm/link-care-context`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linked-contexts", patientId] });
      setAbhaAddress("");
      setCareContextRef("");
    },
  });

  const handleSubmit = () => {
    if (abhaAddress && careContextRef) {
      mutation.mutate({
        abha_address: abhaAddress,
        care_context_reference: careContextRef,
      });
    }
  };

  return (
    <Card className="p-6 mb-6">
      <Heading level={3} className="mb-4">Link Care Context</Heading>
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
        <Button onClick={handleSubmit} isLoading={mutation.isPending}>
          Link to ABDM
        </Button>
      </Box>
    </Card>
  );
}
