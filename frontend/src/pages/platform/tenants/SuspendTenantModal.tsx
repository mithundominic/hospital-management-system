// Responsibility: Form for suspending tenant with reason

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import type { Tenant } from "@/types/platform";

interface SuspendTenantModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hospitalId: string, reason: string) => void;
}

export const SuspendTenantModal = ({
  tenant,
  isOpen,
  onClose,
  onConfirm,
}: SuspendTenantModalProps) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (tenant && reason.trim()) {
      onConfirm(tenant.id, reason);
      setReason("");
      onClose();
    }
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleSubmit} disabled={!reason.trim()}>
        Suspend
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Suspend Tenant: ${tenant?.name || ""}`}
      footer={footer}
    >
      <Box className="space-y-4">
        <Box className="space-y-2">
          <Text className="text-sm font-medium">Suspension Reason</Text>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Payment overdue - 90 days"
          />
        </Box>
      </Box>
    </Modal>
  );
};
