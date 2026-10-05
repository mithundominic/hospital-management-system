// Responsibility: Render tenant cloning modal with confirmation

import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useTenantCloneForm } from "./useTenantCloneForm";
import type { Tenant } from "@/types/platform";

interface Props {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CloneTenantModal = ({
  tenant,
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const { formData, updateField, handleSubmit, loading } = useTenantCloneForm(
    tenant.id,
    tenant.name,
    () => {
      onSuccess();
      onClose();
    },
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Clone Tenant">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Alert variant="warning">
          This will clone settings and departments, but NOT patient data or
          staff.
        </Alert>

        <Box>
          <Label htmlFor="name">New Tenant Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
        </Box>

        <Box>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </Box>

        <Box>
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => updateField("contact", e.target.value)}
          />
        </Box>

        <Button type="submit" disabled={loading}>
          {loading ? "Cloning..." : "Clone Tenant"}
        </Button>
      </Form>
    </Modal>
  );
};
