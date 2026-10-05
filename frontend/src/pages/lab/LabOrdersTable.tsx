// Responsibility: Render the lab orders data table or cards grid using reusable DataTable
import { TestTube } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { LAB_ORDERS_COLUMNS } from "./lab.config";
import { LabOrdersTableRow } from "./LabOrdersTableRow";
import { LabOrderCard } from "./LabOrderCard";
import type { LabOrder } from "@/types";
import type { ViewMode } from "@/types/table.types";

export interface LabOrdersTableProps {
  orders: LabOrder[];
  isLoading: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onNew: () => void;
  onPrint?: (order: LabOrder) => void;
}

export const LabOrdersTable = ({
  orders,
  isLoading,
  viewMode,
  onViewModeChange,
  onNew,
  onPrint,
}: LabOrdersTableProps) => (
  <DataTable
    columns={LAB_ORDERS_COLUMNS}
    data={orders}
    isLoading={isLoading}
    viewMode={viewMode}
    onViewModeChange={onViewModeChange}
    showViewToggle={true}
    emptyIcon={TestTube}
    emptyTitle="No lab orders"
    emptyDescription="Create diagnostic orders for patient encounters."
    emptyActionLabel="New Lab Order"
    onEmptyAction={onNew}
    renderRow={(o) => (
      <LabOrdersTableRow key={o.id} order={o} onPrint={onPrint} />
    )}
    renderCard={(o) => (
      <LabOrderCard key={o.id} order={o} onPrint={onPrint} />
    )}
  />
);

export default LabOrdersTable;
