// Responsibility: Render the insurance claims data table with policy numbers, amounts, and workflow status

import { format } from 'date-fns';
import { Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { InsuranceClaim } from '@/types';

export interface InsuranceClaimsTableProps {
  claims: InsuranceClaim[];
  isLoading: boolean;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  draft: 'default',
  submitted: 'info',
  under_review: 'warning',
  approved: 'success',
  rejected: 'danger',
  settled: 'success',
};

export const InsuranceClaimsTable = ({ claims, isLoading }: InsuranceClaimsTableProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={5} columns={5} />
      </Card>
    );
  }

  if (claims.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Shield}
          title="No claims filed"
          description="Track insurance claims, pre-authorizations, and TPA settlements here."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim #</TableHead>
            <TableHead>Claim Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Claim Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell>
                <Text weight="medium" className="font-mono text-primary-600">
                  {claim.claim_number}
                </Text>
              </TableCell>
              <TableCell>
                <Text size="sm">
                  {claim.claim_date ? format(new Date(claim.claim_date), 'dd MMM yyyy') : 'N/A'}
                </Text>
              </TableCell>
              <TableCell>
                <Badge variant={claim.claim_type === 'cashless' ? 'purple' : 'info'}>
                  {claim.claim_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Text weight="semibold">₹{claim.claim_amount.toLocaleString('en-IN')}</Text>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadgeMap[claim.status] || 'default'}>
                  {claim.status.replace('_', ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
