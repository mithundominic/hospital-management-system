// Responsibility: Form section for hospital name, logo URL, tagline, and brand color

import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HospitalBrandLogo } from "@/components/layout/HospitalBrandLogo";
import type { HospitalSettingsFormState } from "./useHospitalSettingsForm";
import type { Hospital } from "@/types/hospital";

interface HospitalIdentitySectionProps {
  form: HospitalSettingsFormState;
  update: (key: keyof Hospital, val: string) => void;
}

export const HospitalIdentitySection = ({ form, update }: HospitalIdentitySectionProps) => {
  return (
    <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <Flex align="center" gap={3} className="border-b border-gray-100 pb-3">
        <HospitalBrandLogo logoUrl={form.logo_url} name={form.name} size="lg" />
        <Box>
          <Heading level={3} className="text-base font-bold text-gray-900">
            Brand Identity & Appearance
          </Heading>
          <Text size="xs" variant="muted">
            Configure how your hospital appears in the navigation sidebar, letterhead, and document outputs.
          </Text>
        </Box>
      </Flex>

      <Grid cols={2} gap={4}>
        <Input
          label="Hospital Legal Name *"
          value={form.name || ""}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Apollo Speciality Hospital"
          required
        />
        <Input
          label="Brand Tagline / Specialty"
          value={form.tagline || ""}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="e.g. Touching Lives, Transforming Healthcare"
        />
      </Grid>

      <Grid cols={2} gap={4}>
        <Input
          label="Logo Image URL (or Storage Asset)"
          value={form.logo_url || ""}
          onChange={(e) => update("logo_url", e.target.value)}
          placeholder="https://... or bucket asset URL"
        />
        <Input
          label="Primary Theme Color"
          type="color"
          value={form.brand_color || "#2563eb"}
          onChange={(e) => update("brand_color", e.target.value)}
        />
      </Grid>
    </Box>
  );
};
