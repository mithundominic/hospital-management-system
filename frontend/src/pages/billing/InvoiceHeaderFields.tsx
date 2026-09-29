// Responsibility: Patient selector and invoice/due date input fields

import type { Dispatch, SetStateAction } from "react";
import { Grid } from "@/components/ui/Grid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { InvoiceFormData } from "./invoice.types";

interface InvoiceHeaderFieldsProps {
  formData: InvoiceFormData;
  setFormData: Dispatch<SetStateAction<InvoiceFormData>>;
  patientOpts: Array<{ value: string; label: string }>;
}

export const InvoiceHeaderFields = ({
  formData,
  setFormData,
  patientOpts,
}: InvoiceHeaderFieldsProps) => (
  <Grid cols={3} gap={3}>
    <Select
      label="Patient *"
      value={formData.patient_id}
      onChange={(e) =>
        setFormData((p) => ({ ...p, patient_id: e.target.value }))
      }
      options={patientOpts}
      required
    />
    <Input
      label="Invoice Date"
      type="date"
      value={formData.invoice_date}
      onChange={(e) =>
        setFormData((p) => ({ ...p, invoice_date: e.target.value }))
      }
    />
    <Input
      label="Due Date"
      type="date"
      value={formData.due_date}
      onChange={(e) => setFormData((p) => ({ ...p, due_date: e.target.value }))}
    />
  </Grid>
);
