// Responsibility: Render inventory items table with stock levels, units, and status badges

import { Pill } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody } from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { PHARMACY_TABLE_COLUMNS } from "./pharmacy.config";
import { PharmacyTableRow } from "./PharmacyTableRow";
import type { InventoryItem } from "@/types";

export interface PharmacyTableProps {
  items: InventoryItem[];
  isLoading: boolean;
}

export const PharmacyTable = ({ items, isLoading }: PharmacyTableProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={6} columns={6} />
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Pill}
          title="No inventory items"
          description="Medicine catalog and pharmacy stock will appear here."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <DataTableHeader columns={PHARMACY_TABLE_COLUMNS} />
        <TableBody>
          {items.map((item) => (
            <PharmacyTableRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PharmacyTable;
