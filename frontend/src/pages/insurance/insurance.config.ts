// Responsibility: Insurance table column and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { InsuranceClaim } from "@/types";

export const INSURANCE_CLAIMS_COLUMNS: TableColumn<InsuranceClaim>[] = [
  { key: "claim_number", header: "Claim #" },
  { key: "claim_date", header: "Claim Date" },
  { key: "claim_type", header: "Type" },
  { key: "claim_amount", header: "Claim Amount" },
  { key: "status", header: "Status" },
];
