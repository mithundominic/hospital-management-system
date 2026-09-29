// Responsibility: Lab order table column and UI configurations

import type { TableColumn } from "@/types/table.types";
import type { LabOrder } from "@/types";

export const LAB_ORDERS_COLUMNS: TableColumn<LabOrder>[] = [
  { key: "test_name", header: "Test Name" },
  { key: "ordered_date", header: "Ordered Date" },
  { key: "priority", header: "Priority" },
  { key: "status", header: "Status" },
];
