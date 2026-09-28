// Responsibility: Render metric cards summarizing insurance claims by status

import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatCard } from "@/components/common/StatCard";
import type { InsuranceClaim } from "@/types";

export interface InsuranceStatCardsProps {
  claims: InsuranceClaim[];
}

export const InsuranceStatCards = ({ claims }: InsuranceStatCardsProps) => {
  const stats = [
    {
      label: "Total Claims",
      count: claims.length,
      icon: Shield,
      color: "text-blue-600",
    },
    {
      label: "Pending",
      count: claims.filter(
        (c) => c.status === "submitted" || c.status === "under_review",
      ).length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Approved",
      count: claims.filter(
        (c) => c.status === "approved" || c.status === "settled",
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      count: claims.filter((c) => c.status === "rejected").length,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  return (
    <Grid cols={4} gap={6}>
      {stats.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.count}
          icon={s.icon}
          iconColor={s.color}
          cardPadding="p-4"
        />
      ))}
    </Grid>
  );
};
