// Responsibility: Render invoice status metric cards for billing overview

import { Receipt, CheckCircle, Clock, DollarSign } from "lucide-react";
import {
  StatCardGrid,
  type StatItemConfig,
} from "@/components/common/StatCardGrid";
import { computeBillingMetrics } from "./billing.utils";
import type { Invoice } from "@/types";

export interface BillingStatCardsProps {
  invoices: Invoice[];
}

export const BillingStatCards = ({ invoices }: BillingStatCardsProps) => {
  const metrics = computeBillingMetrics(invoices);

  const stats: StatItemConfig[] = [
    {
      label: "Total Invoices",
      value: metrics.total,
      icon: Receipt,
      iconColor: "text-blue-600",
      cardPadding: "p-4",
    },
    {
      label: "Paid",
      value: metrics.paid,
      icon: CheckCircle,
      iconColor: "text-green-600",
      cardPadding: "p-4",
    },
    {
      label: "Pending",
      value: metrics.pending,
      icon: Clock,
      iconColor: "text-yellow-600",
      cardPadding: "p-4",
    },
    {
      label: "Overdue",
      value: metrics.overdue,
      icon: DollarSign,
      iconColor: "text-red-600",
      cardPadding: "p-4",
    },
  ];

  return <StatCardGrid stats={stats} cols={4} gap={6} />;
};
