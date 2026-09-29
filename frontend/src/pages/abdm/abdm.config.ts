// Responsibility: ABDM table column, tabs, and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { TabItem } from "@/components/ui/Tabs";
import type { ConsentArtifact } from "./abdm.types";

export type AbhaTabId = "verify" | "history";
export type ConsentTabId = "artifacts" | "request";

export const CONSENT_ARTIFACT_COLUMNS: TableColumn<ConsentArtifact>[] = [
  { key: "purpose", header: "Purpose" },
  { key: "status", header: "Status" },
  { key: "requestId", header: "Request ID" },
  { key: "artifactId", header: "Artifact ID" },
  { key: "requested", header: "Requested" },
  { key: "resolved", header: "Resolved" },
];

export const buildAbhaTabs = (
  historyCount: number,
): readonly TabItem<AbhaTabId>[] =>
  [
    { id: "verify", label: "Verify ABHA" },
    { id: "history", label: "Transaction History", count: historyCount },
  ] as const;

export const buildConsentTabs = (
  artifactCount: number,
): readonly TabItem<ConsentTabId>[] =>
  [
    { id: "artifacts", label: "Active Consents", count: artifactCount },
    { id: "request", label: "Request New Consent" },
  ] as const;
