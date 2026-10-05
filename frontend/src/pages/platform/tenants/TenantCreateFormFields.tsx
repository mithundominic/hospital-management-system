// Responsibility: Render form fields for tenant creation form

import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TIMEZONES, LOCALES, CURRENCIES } from "./tenantCreate.constants";
import type { TenantCreateData } from "./useTenantCreateForm";

interface Props {
  formData: TenantCreateData;
  updateField: (field: keyof TenantCreateData, value: string) => void;
}

export const TenantCreateFormFields = ({ formData, updateField }: Props) => {
  return (
    <Box className="space-y-4">
      <Input
        id="name"
        label="Name *"
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
        required
      />
      <Input
        id="address"
        label="Address"
        value={formData.address}
        onChange={(e) => updateField("address", e.target.value)}
      />
      <Input
        id="contact"
        label="Contact"
        value={formData.contact}
        onChange={(e) => updateField("contact", e.target.value)}
      />
      <Input
        id="license_info"
        label="License Info"
        value={formData.license_info}
        onChange={(e) => updateField("license_info", e.target.value)}
      />
      <Select
        id="timezone"
        label="Timezone"
        value={formData.timezone}
        options={TIMEZONES}
        onChange={(e) => updateField("timezone", e.target.value)}
      />
      <Select
        id="locale"
        label="Locale"
        value={formData.locale}
        options={LOCALES}
        onChange={(e) => updateField("locale", e.target.value)}
      />
      <Select
        id="currency"
        label="Currency"
        value={formData.currency}
        options={CURRENCIES}
        onChange={(e) => updateField("currency", e.target.value)}
      />
    </Box>
  );
};
