// Responsibility: Render the lab orders data table with priority and status chips

import { TestTube } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody } from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { LAB_ORDERS_COLUMNS } from "./lab.config";
import { LabOrdersTableRow } from "./LabOrdersTableRow";
import type { LabOrder } from "@/types";

export interface LabOrdersTableProps {
  orders: LabOrder[];
  isLoading: boolean;
  onNew: () => void;
}

export const LabOrdersTable = ({
  orders,
  isLoading,
  onNew,
}: LabOrdersTableProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={5} columns={4} />
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={TestTube}
          title="No lab orders"
          description="Create diagnostic orders for patient encounters."
          actionLabel="New Lab Order"
          onAction={onNew}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <DataTableHeader columns={LAB_ORDERS_COLUMNS} />
        <TableBody>
          {orders.map((o) => (
            <LabOrdersTableRow key={o.id} order={o} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default LabOrdersTable;
