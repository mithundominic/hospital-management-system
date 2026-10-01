// Responsibility: Hospital settings tab configurations and types

import type { TabItem } from "@/components/ui/Tabs";

export type SettingsTabId = "identity" | "contact" | "legal";

export const SETTINGS_TABS: readonly TabItem<SettingsTabId>[] = [
  { id: "identity", label: "Identity & Branding" },
  { id: "contact", label: "Contact & Address" },
  { id: "legal", label: "Legal & Statutory" },
] as const;
