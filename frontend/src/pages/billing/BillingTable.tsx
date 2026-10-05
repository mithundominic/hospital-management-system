// Responsibility: Render the invoices data table or cards grid using reusable DataTable
import { Receipt } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { BILLING_TABLE_COLUMNS } from "./billing.config";
import { BillingTableRow } from "./BillingTableRow";
import { BillingCard } from "./BillingCard";
import type { Invoice } from "@/types";
import type { ViewMode } from "@/types/table.types";

export interface BillingTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onNew: () => void;
  onPrint?: (invoice: Invoice) => void;
}

export const BillingTable = ({
  invoices,
  isLoading,
  viewMode,
  onViewModeChange,
  onNew,
  onPrint,
}: BillingTableProps) => (
  <DataTable
    columns={BILLING_TABLE_COLUMNS}
    data={invoices}
    isLoading={isLoading}
    viewMode={viewMode}
    onViewModeChange={onViewModeChange}
    showViewToggle={true}
    emptyIcon={Receipt}
    emptyTitle="No invoices found"
    emptyDescription="Generate billing records for consultations, lab, and pharmacy."
    emptyActionLabel="New Invoice"
    onEmptyAction={onNew}
    renderRow={(inv) => (
      <BillingTableRow key={inv.id} invoice={inv} onPrint={onPrint} />
    )}
    renderCard={(inv) => (
      <BillingCard key={inv.id} invoice={inv} onPrint={onPrint} />
    )}
  />
);

export default BillingTable;
