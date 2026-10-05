// Responsibility: Render BAA document upload modal

import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { useBAAForm } from "./useBAAForm";
import type { Tenant } from "@/types/platform";

interface Props {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BAAUploadModal = ({
  tenant,
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const { formData, updateField, handleSubmit, loading } = useBAAForm(
    tenant.id,
    () => {
      onSuccess();
      onClose();
    },
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload BAA Document">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Box>
          <Label htmlFor="document_url">Document URL *</Label>
          <Input
            id="document_url"
            value={formData.document_url}
            onChange={(e) => updateField("document_url", e.target.value)}
            placeholder="https://example.com/baa-document.pdf"
            required
          />
        </Box>

        <Box>
          <Label htmlFor="signed_at">Signed Date</Label>
          <Input
            id="signed_at"
            type="date"
            value={formData.signed_at}
            onChange={(e) => updateField("signed_at", e.target.value)}
          />
        </Box>

        <Box>
          <Label htmlFor="expires_at">Expires Date</Label>
          <Input
            id="expires_at"
            type="date"
            value={formData.expires_at}
            onChange={(e) => updateField("expires_at", e.target.value)}
          />
        </Box>

        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Document"}
        </Button>
      </Form>
    </Modal>
  );
};
