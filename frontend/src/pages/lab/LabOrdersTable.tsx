// Responsibility: Render the lab orders data table with priority and status chips

import { format } from 'date-fns';
import { TestTube } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { LabOrder } from '@/types';

export interface LabOrdersTableProps {
  orders: LabOrder[];
  isLoading: boolean;
  onNew: () => void;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'danger',
};

export const LabOrdersTable = ({ orders, isLoading, onNew }: LabOrdersTableProps) => {
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
        <TableHeader>
          <TableRow>
            <TableHead>Test Name</TableHead>
            <TableHead>Ordered Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>
                <Text weight="medium">{o.test_name}</Text>
                {o.test_code && <Text size="xs" variant="muted">Code: {o.test_code}</Text>}
              </TableCell>
              <TableCell>
                <Text size="sm">
                  {o.ordered_date ? format(new Date(o.ordered_date), 'dd MMM yyyy') : 'N/A'}
                </Text>
              </TableCell>
              <TableCell>
                <Badge variant={o.priority === 'stat' ? 'danger' : o.priority === 'urgent' ? 'warning' : 'default'}>
                  {o.priority.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadgeMap[o.status] || 'default'}>
                  {o.status.replace('_', ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
