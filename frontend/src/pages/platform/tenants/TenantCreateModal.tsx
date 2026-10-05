// Responsibility: Render tenant creation modal dialog

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Form } from "@/components/ui/Form";
import { useTenantCreateForm } from "./useTenantCreateForm";
import { TenantCreateFormFields } from "./TenantCreateFormFields";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TenantCreateModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const { formData, updateField, handleSubmit, loading } = useTenantCreateForm(
    () => {
      onSuccess();
      onClose();
    },
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Tenant">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <TenantCreateFormFields formData={formData} updateField={updateField} />
        <Box className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Tenant"}
          </Button>
        </Box>
      </Form>
    </Modal>
  );
};
