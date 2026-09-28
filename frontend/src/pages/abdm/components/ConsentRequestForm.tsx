// Responsibility: Form to request patient consent for health records access

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHospital } from "@/contexts/HospitalContext";
import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ConsentRequestFormProps {
  patientId: string;
}

export function ConsentRequestForm({ patientId }: ConsentRequestFormProps) {
  const { currentHospital } = useHospital();
  const [abhaAddress, setAbhaAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { abha_address: string; purpose: string }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return api.post(
        `/hospitals/${currentHospital.id}/patients/${patientId}/abdm/consent-requests`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consent-artifacts", patientId] });
      setAbhaAddress("");
      setPurpose("");
    },
  });

  const handleSubmit = () => {
    if (abhaAddress && purpose) {
      mutation.mutate({ abha_address: abhaAddress, purpose });
    }
  };

  return (
    <Card className="p-6 mb-6">
      <Heading level={3} className="mb-4">Request Patient Consent</Heading>
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
        <Button onClick={handleSubmit} isLoading={mutation.isPending}>
          Request Consent
        </Button>
      </Box>
    </Card>
  );
}
