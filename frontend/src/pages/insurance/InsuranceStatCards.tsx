// Responsibility: Render metric cards summarizing insurance claims by status

import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  StatCardGrid,
  type StatItemConfig,
} from "@/components/common/StatCardGrid";
import type { InsuranceClaim } from "@/types";

export interface InsuranceStatCardsProps {
  claims: InsuranceClaim[];
}

export const InsuranceStatCards = ({ claims }: InsuranceStatCardsProps) => {
  const stats: StatItemConfig[] = [
    {
      label: "Total Claims",
      value: claims.length,
      icon: Shield,
      iconColor: "text-blue-600",
      cardPadding: "p-4",
    },
    {
      label: "Pending",
      value: claims.filter(
        (c) => c.status === "submitted" || c.status === "under_review",
      ).length,
      icon: Clock,
      iconColor: "text-yellow-600",
      cardPadding: "p-4",
    },
    {
      label: "Approved",
      value: claims.filter(
        (c) => c.status === "approved" || c.status === "settled",
      ).length,
      icon: CheckCircle,
      iconColor: "text-green-600",
      cardPadding: "p-4",
    },
    {
      label: "Rejected",
      value: claims.filter((c) => c.status === "rejected").length,
      icon: XCircle,
      iconColor: "text-red-600",
      cardPadding: "p-4",
    },
  ];

  return <StatCardGrid stats={stats} cols={4} gap={6} />;
};

export default InsuranceStatCards;
