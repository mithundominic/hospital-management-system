// Responsibility: Render inventory items table with stock levels, units, and status badges

import { Pill } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonTable } from "@/components/common/SkeletonTable";
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
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Reorder Level</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
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
