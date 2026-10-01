// Responsibility: IPD tabs and UI configuration

import type { TabItem } from "@/components/ui/Tabs";

export type IPDTabId = "all" | "available" | "occupied";

export const buildIPDTabs = (
  allCount: number,
  availableCount: number,
  occupiedCount: number,
): readonly TabItem<IPDTabId>[] => [
  { id: "all", label: "All Beds", count: allCount },
  { id: "available", label: "Available", count: availableCount },
  { id: "occupied", label: "Occupied", count: occupiedCount },
] as const;
