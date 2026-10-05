// Responsibility: Render low stock inventory alert table using reusable DataTable component

import { AlertTriangle } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { DataTable } from "@/components/common/DataTable";
import { REPORTS_LOW_STOCK_COLUMNS } from "./reports.config";
import type { LowStockItem } from "@/types";

export interface ReportsLowStockTableProps {
  lowStock: LowStockItem[];
}

export const ReportsLowStockTable = ({
  lowStock,
}: ReportsLowStockTableProps) => {
  if (lowStock.length === 0) return null;

  return (
    <DataTable
      columns={REPORTS_LOW_STOCK_COLUMNS}
      data={lowStock}
      emptyIcon={AlertTriangle}
      emptyTitle="No low stock alerts"
      emptyDescription="All inventory items are currently above their reorder thresholds."
      containerClassName="max-h-[460px] overflow-auto"
      renderRow={(item) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium text-gray-900">
            {item.item_name}
          </TableCell>
          <TableCell className="font-semibold text-red-600">
            {item.quantity_in_stock}
          </TableCell>
          <TableCell>{item.reorder_level}</TableCell>
          <TableCell>{item.category || "General"}</TableCell>
        </TableRow>
      )}
    />
  );
};

export default ReportsLowStockTable;
