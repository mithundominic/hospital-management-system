// Responsibility: Render branding configuration modal

import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { BrandingPreview } from "./BrandingPreview";
import { BrandingColorFields } from "./BrandingColorFields";
import { useBrandingForm } from "./useBrandingForm";
import type { Tenant } from "@/types/platform";

interface Props {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BrandingModal = ({
  tenant,
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const initialBranding = tenant.hospital_branding?.[0];
  const { formData, updateField, updateColorScheme, handleSubmit, loading } =
    useBrandingForm(tenant.id, initialBranding, () => {
      onSuccess();
      onClose();
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Branding" maxWidth="lg">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Box>
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            value={formData.logo_url}
            onChange={(e) => updateField("logo_url", e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </Box>

        <BrandingColorFields
          colorScheme={formData.color_scheme}
          onChange={updateColorScheme}
        />

        <Box>
          <Label htmlFor="custom_domain">Custom Domain</Label>
          <Input
            id="custom_domain"
            value={formData.custom_domain}
            onChange={(e) => updateField("custom_domain", e.target.value)}
            placeholder="hospital.example.com"
          />
        </Box>

        <BrandingPreview
          logo_url={formData.logo_url}
          color_scheme={formData.color_scheme}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Branding"}
        </Button>
      </Form>
    </Modal>
  );
};
