// Responsibility: Form section for statutory IDs, accreditation, and document disclaimers

import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { HospitalSettingsFormState } from "./useHospitalSettingsForm";
import type { Hospital } from "@/types/hospital";

interface HospitalLegalSectionProps {
  form: HospitalSettingsFormState;
  update: (key: keyof Hospital, val: string) => void;
}

export const HospitalLegalSection = ({ form, update }: HospitalLegalSectionProps) => {
  return (
    <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <Box className="border-b border-gray-100 pb-3">
        <Heading level={3} className="text-base font-bold text-gray-900">
          Statutory Registration & Document Disclaimers
        </Heading>
        <Text size="xs" variant="muted">
          Mandatory compliance identifiers for NMC prescriptions, CGST Rule 46 invoices, and NABH records.
        </Text>
      </Box>

      <Grid cols={3} gap={4}>
        <Input
          label="Hospital Clinical Reg. No."
          value={form.registration_number || ""}
          onChange={(e) => update("registration_number", e.target.value)}
          placeholder="REG-2024-001"
        />
        <Input
          label="GSTIN (Tax Identification)"
          value={form.gst_number || ""}
          onChange={(e) => update("gst_number", e.target.value)}
          placeholder="33AAACA1234A1Z5"
        />
        <Input
          label="NABH / NABL Accreditation No."
          value={form.nabh_number || ""}
          onChange={(e) => update("nabh_number", e.target.value)}
          placeholder="NABH-2024-H-0192"
        />
      </Grid>

      <Grid cols={2} gap={4}>
        <Textarea
          label="Prescription (Rx) Footer Note"
          value={form.prescription_footer || ""}
          onChange={(e) => update("prescription_footer", e.target.value)}
          placeholder="e.g. Generic substitution authorized as per NMC guidelines. Valid for 7 days."
          rows={2}
        />
        <Textarea
          label="Invoice Terms & Conditions"
          value={form.invoice_notes || ""}
          onChange={(e) => update("invoice_notes", e.target.value)}
          placeholder="e.g. Medicines once dispensed cannot be returned. Disputes subject to local jurisdiction."
          rows={2}
        />
      </Grid>
    </Box>
  );
};
