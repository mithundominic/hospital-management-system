// Responsibility: Render the invoices data table with financial amounts and status badges

import { Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody } from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { BILLING_TABLE_COLUMNS } from "./billing.config";
import { BillingTableRow } from "./BillingTableRow";
import type { Invoice } from "@/types";

export interface BillingTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onNew: () => void;
}

export const BillingTable = ({
  invoices,
  isLoading,
  onNew,
}: BillingTableProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={6} columns={5} />
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Receipt}
          title="No invoices found"
          description="Generate billing records for consultations, lab, and pharmacy."
          actionLabel="New Invoice"
          onAction={onNew}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <DataTableHeader columns={BILLING_TABLE_COLUMNS} />
        <TableBody>
          {invoices.map((inv) => (
            <BillingTableRow key={inv.id} invoice={inv} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BillingTable;
