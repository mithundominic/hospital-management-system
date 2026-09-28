// Responsibility: Render the invoices data table with financial amounts and status badges

import { Receipt } from "lucide-react";
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
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Tax (GST)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
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
