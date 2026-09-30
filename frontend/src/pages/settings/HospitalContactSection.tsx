// Responsibility: Form section for hospital contact details and street address

import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { HospitalSettingsFormState } from "./useHospitalSettingsForm";
import type { Hospital } from "@/types/hospital";

interface HospitalContactSectionProps {
  form: HospitalSettingsFormState;
  update: (key: keyof Hospital, val: string) => void;
}

export const HospitalContactSection = ({ form, update }: HospitalContactSectionProps) => {
  return (
    <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <Box className="border-b border-gray-100 pb-3">
        <Heading level={3} className="text-base font-bold text-gray-900">
          Official Contact & Location
        </Heading>
        <Text size="xs" variant="muted">
          Printed on official prescriptions, invoices, and emergency headers.
        </Text>
      </Box>

      <Grid cols={3} gap={4}>
        <Input
          label="24x7 Emergency Helpline / Phone"
          value={form.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+91 44 2829 0200"
        />
        <Input
          label="Official Email Address"
          type="email"
          value={form.email || ""}
          onChange={(e) => update("email", e.target.value)}
          placeholder="contact@hospital.com"
        />
        <Input
          label="Hospital Website"
          value={form.website || ""}
          onChange={(e) => update("website", e.target.value)}
          placeholder="https://hospital.org"
        />
      </Grid>

      <Input
        label="Street Address"
        value={form.address || ""}
        onChange={(e) => update("address", e.target.value)}
        placeholder="e.g. 21 Greams Lane, Off Greams Road"
      />

      <Grid cols={3} gap={4}>
        <Input
          label="City"
          value={form.city || ""}
          onChange={(e) => update("city", e.target.value)}
          placeholder="Chennai"
        />
        <Input
          label="State"
          value={form.state || ""}
          onChange={(e) => update("state", e.target.value)}
          placeholder="Tamil Nadu"
        />
        <Input
          label="Pincode"
          value={form.pincode || ""}
          onChange={(e) => update("pincode", e.target.value)}
          placeholder="600006"
        />
      </Grid>
    </Box>
  );
};
