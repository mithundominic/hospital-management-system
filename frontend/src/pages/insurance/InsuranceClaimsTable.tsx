// Responsibility: Render the insurance claims data table with policy numbers, amounts, and workflow status

import { Shield } from "lucide-react";
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
import { InsuranceClaimsTableRow } from "./InsuranceClaimsTableRow";
import type { InsuranceClaim } from "@/types";

export interface InsuranceClaimsTableProps {
  claims: InsuranceClaim[];
  isLoading: boolean;
}

export const InsuranceClaimsTable = ({
  claims,
  isLoading,
}: InsuranceClaimsTableProps) => {
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
            <InsuranceClaimsTableRow key={claim.id} claim={claim} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default InsuranceClaimsTable;
