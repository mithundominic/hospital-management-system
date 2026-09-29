// Responsibility: Render the insurance claims data table with policy numbers, amounts, and workflow status

import { Shield } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody } from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { INSURANCE_CLAIMS_COLUMNS } from "./insurance.config";
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
        <DataTableHeader columns={INSURANCE_CLAIMS_COLUMNS} />
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
