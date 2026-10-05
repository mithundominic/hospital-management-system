// Responsibility: Render inventory items table or cards grid using reusable DataTable
import { Pill } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { PHARMACY_TABLE_COLUMNS } from "./pharmacy.config";
import { PharmacyTableRow } from "./PharmacyTableRow";
import { PharmacyCard } from "./PharmacyCard";
import type { InventoryItem } from "@/types";
import type { ViewMode } from "@/types/table.types";

export interface PharmacyTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export const PharmacyTable = ({
  items,
  isLoading,
  viewMode,
  onViewModeChange,
}: PharmacyTableProps) => (
  <DataTable
    columns={PHARMACY_TABLE_COLUMNS}
    data={items}
    isLoading={isLoading}
    viewMode={viewMode}
    onViewModeChange={onViewModeChange}
    showViewToggle={true}
    emptyIcon={Pill}
    emptyTitle="No inventory items"
    emptyDescription="Medicine catalog and pharmacy stock will appear here."
    renderRow={(item) => (
      <PharmacyTableRow
        key={item.id || item.inventory_item_id || item.name}
        item={item}
      />
    )}
    renderCard={(item) => (
      <PharmacyCard
        key={item.id || item.inventory_item_id || item.name}
        item={item}
      />
    )}
  />
);

export default PharmacyTable;
