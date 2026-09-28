// Responsibility: Render single insurance claim row with status and type badges

import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { claimStatusConfig, appConfig } from "@/configs";
import type { ClaimStatus } from "@/constants";
import type { InsuranceClaim } from "@/types";

export interface InsuranceClaimsTableRowProps {
  claim: InsuranceClaim;
}

const claimTypeBadgeMap: Record<string, BadgeVariant> = {
  cashless: "purple",
  reimbursement: "info",
};

export const InsuranceClaimsTableRow = ({
  claim,
}: InsuranceClaimsTableRowProps) => {
  const badgeConfig = claimStatusConfig[claim.status as ClaimStatus] || {
    label: claim.status.replace("_", " "),
    variant: "default" as const,
  };

  return (
  <TableRow>
    <TableCell>
      <Text weight="medium" className="font-mono text-primary-600">
        {claim.claim_number}
      </Text>
    </TableCell>
    <TableCell>
      <Text size="sm">
        {claim.claim_date ? format(new Date(claim.claim_date), "dd MMM yyyy") : "N/A"}
      </Text>
    </TableCell>
    <TableCell>
      <Badge variant={claimTypeBadgeMap[claim.claim_type] || "default"}>
        {claim.claim_type}
      </Badge>
    </TableCell>
      <TableCell>
        <Text weight="semibold">
          {appConfig.currency.symbol}{claim.claim_amount.toLocaleString("en-IN")}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
      </TableCell>
    </TableRow>
  );
};

export default InsuranceClaimsTableRow;
