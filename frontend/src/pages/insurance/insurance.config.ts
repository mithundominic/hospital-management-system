// Responsibility: Insurance table column, tabs, and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { TabItem } from "@/components/ui/Tabs";
import type { InsuranceClaim } from "@/types";

export type InsuranceTabId = "all" | "under_review" | "settled";

export const INSURANCE_CLAIMS_COLUMNS: TableColumn<InsuranceClaim>[] = [
  { key: "claim_number", header: "Claim #" },
  { key: "claim_date", header: "Claim Date" },
  { key: "claim_type", header: "Type" },
  { key: "claim_amount", header: "Claim Amount" },
  { key: "status", header: "Status" },
];

export const buildInsuranceTabs = (
  allCount: number,
  underReviewCount: number,
  settledCount: number,
): readonly TabItem<InsuranceTabId>[] => [
  { id: "all", label: "All Claims", count: allCount },
  { id: "under_review", label: "Under Review & Pending", count: underReviewCount },
  { id: "settled", label: "Settled & Approved", count: settledCount },
] as const;
