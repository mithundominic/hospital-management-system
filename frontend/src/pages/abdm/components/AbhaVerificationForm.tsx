// Responsibility: Form for initiating and confirming ABHA verification

import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAbhaVerificationForm } from "../hooks/useAbhaVerificationForm";

interface AbhaVerificationFormProps {
  patientId: string;
}

export function AbhaVerificationForm({ patientId }: AbhaVerificationFormProps) {
  const {
    abhaAddress,
    setAbhaAddress,
    otp,
    setOtp,
    transactionId,
    handleInitiate,
    handleConfirm,
    isInitiating,
    isConfirming,
  } = useAbhaVerificationForm(patientId);

  return (
    <Card className="p-6 mb-6">
      <Heading level={2} className="mb-4">
        Verify ABHA Address
      </Heading>
      {!transactionId ? (
        <Box className="space-y-4 max-w-md">
          <Input
            label="ABHA Address"
            placeholder="e.g., username@abdm"
            value={abhaAddress}
            onChange={(e) => setAbhaAddress(e.target.value)}
          />
          <Button onClick={handleInitiate} isLoading={isInitiating}>
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
          <Button onClick={handleConfirm} isLoading={isConfirming}>
            Confirm OTP
          </Button>
        </Box>
      )}
    </Card>
  );
}
