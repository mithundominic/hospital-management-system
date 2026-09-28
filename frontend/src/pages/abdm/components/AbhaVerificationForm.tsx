// Responsibility: Form for initiating and confirming ABHA verification

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHospital } from "@/contexts/HospitalContext";
import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AbhaVerificationResponse } from "../abdm.types";

interface AbhaVerificationFormProps {
  patientId: string;
}

export function AbhaVerificationForm({ patientId }: AbhaVerificationFormProps) {
  const { currentHospital } = useHospital();
  const [abhaAddress, setAbhaAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const initiateMutation = useMutation({
    mutationFn: async (data: { abha_address: string }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return api.post<AbhaVerificationResponse>(
        `/hospitals/${currentHospital.id}/patients/${patientId}/abdm/verify`,
        data,
      );
    },
    onSuccess: (response: AbhaVerificationResponse) => {
      setTransactionId(response.abdm_request_id);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (data: { transaction_id: string; otp: string }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return api.post(
        `/hospitals/${currentHospital.id}/patients/${patientId}/abdm/confirm`,
        data,
      );
    },
  });

  const handleInitiate = () => {
    if (abhaAddress) {
      initiateMutation.mutate({ abha_address: abhaAddress });
    }
  };

  const handleConfirm = () => {
    if (transactionId && otp) {
      confirmMutation.mutate({ transaction_id: transactionId, otp });
    }
  };

  return (
    <Card className="p-6 mb-6">
      <Heading level={2} className="mb-4">Verify ABHA Address</Heading>
      {!transactionId ? (
        <Box className="space-y-4 max-w-md">
          <Input
            label="ABHA Address"
            placeholder="e.g., username@abdm"
            value={abhaAddress}
            onChange={(e) => setAbhaAddress(e.target.value)}
          />
          <Button onClick={handleInitiate} isLoading={initiateMutation.isPending}>
            Send OTP
          </Button>
        </Box>
      ) : (
        <Box className="space-y-4 max-w-md">
          <Text size="sm" variant="muted">
            OTP sent to ABHA address. Transaction ID: {transactionId}
          </Text>
          <Input
            label="OTP Code"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={handleConfirm} isLoading={confirmMutation.isPending}>
            Confirm OTP
          </Button>
        </Box>
      )}
    </Card>
  );
}
