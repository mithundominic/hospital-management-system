// Responsibility: Render the invoices data table with financial amounts and status badges

import { format } from 'date-fns';
import { Receipt } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { Invoice } from '@/types';

export interface BillingTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onNew: () => void;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  draft: 'default',
  pending: 'warning',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'default',
};

export const BillingTable = ({ invoices, isLoading, onNew }: BillingTableProps) => {
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
            <TableRow key={inv.id}>
              <TableCell>
                <Text weight="medium" className="font-mono text-primary-600">
                  {inv.invoice_number}
                </Text>
              </TableCell>
              <TableCell>
                <Text size="sm">
                  {inv.invoice_date ? format(new Date(inv.invoice_date), 'dd MMM yyyy') : 'N/A'}
                </Text>
              </TableCell>
              <TableCell>
                <Text weight="semibold">₹{inv.total_amount.toLocaleString('en-IN')}</Text>
              </TableCell>
              <TableCell>
                <Text size="sm" variant="muted">₹{inv.tax_amount.toLocaleString('en-IN')}</Text>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadgeMap[inv.status] || 'default'}>
                  {inv.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
