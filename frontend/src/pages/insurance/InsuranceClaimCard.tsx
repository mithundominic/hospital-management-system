// Responsibility: Render individual insurance claim in card grid view
import { memo } from "react";
import { format } from "date-fns";
import { Shield } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { claimStatusConfig, claimTypeConfig, appConfig } from "@/configs";
import type { ClaimStatus } from "@/constants";
import type { InsuranceClaim } from "@/types";

export interface InsuranceClaimCardProps {
  claim: InsuranceClaim;
}

export const InsuranceClaimCard = memo(({ claim }: InsuranceClaimCardProps) => {
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
    <DataCard
      title={claim.claim_number}
      subtitle={dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A"}
      icon={<Shield className="h-6 w-6" />}
      badge={<Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>}
      fields={[
        {
          label: "Claim Type",
          value: <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>,
        },
        {
          label: "Claimed Amount",
          value: `${appConfig.currency.symbol}${amount.toLocaleString("en-IN")}`,
        },
      ]}
    />
  );
});

InsuranceClaimCard.displayName = "InsuranceClaimCard";

export default InsuranceClaimCard;
