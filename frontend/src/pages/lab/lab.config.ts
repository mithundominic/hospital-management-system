// Responsibility: Lab order table column, tabs, and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { TabItem } from "@/components/ui/Tabs";
import type { LabOrder } from "@/types";

export type LabOrdersTabId = "all" | "pending" | "completed";

export const LAB_ORDERS_COLUMNS: TableColumn<LabOrder>[] = [
  { key: "test_name", header: "Test Name" },
  { key: "ordered_date", header: "Ordered Date" },
  { key: "priority", header: "Priority" },
  { key: "status", header: "Status" },
  { key: "id", header: "Actions" },
];

export const buildLabOrdersTabs = (
  allCount: number,
  pendingCount: number,
  completedCount: number,
): readonly TabItem<LabOrdersTabId>[] => [
  { id: "all", label: "All Orders", count: allCount },
  { id: "pending", label: "Pending Tests", count: pendingCount },
  { id: "completed", label: "Completed Results", count: completedCount },
] as const;
