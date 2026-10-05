// Responsibility: Render single insurance claim row with status and type badges

import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { claimStatusConfig, claimTypeConfig, appConfig } from "@/configs";
import type { ClaimStatus } from "@/constants";
import type { InsuranceClaim } from "@/types";

export interface InsuranceClaimsTableRowProps {
  claim: InsuranceClaim;
}

export const InsuranceClaimsTableRow = ({
  claim,
}: InsuranceClaimsTableRowProps) => {
  const badgeConfig = claimStatusConfig[claim.status as ClaimStatus] || {
    label: (claim.status || "submitted").replace("_", " "),
    variant: "default" as const,
  };
  const dateStr = claim.claim_date || claim.submitted_at || claim.created_at;
  const amount = Number(claim.claimed_amount ?? claim.claim_amount) || 0;
  const claimType = claim.claim_type || "cashless";
  const typeConfig = claimTypeConfig[claimType] || {
    label: claimType.toUpperCase(),
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
          {dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A"}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={typeConfig.variant}>
          {typeConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Text weight="semibold">
          {appConfig.currency.symbol}
          {amount.toLocaleString("en-IN")}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
      </TableCell>
    </TableRow>
  );
};

export default InsuranceClaimsTableRow;
