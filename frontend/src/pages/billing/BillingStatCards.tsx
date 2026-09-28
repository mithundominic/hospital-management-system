// Responsibility: Render invoice status metric cards for billing overview

import { Receipt, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatCard } from "@/components/common/StatCard";
import type { Invoice } from "@/types";

export interface BillingStatCardsProps {
  invoices: Invoice[];
}

export const BillingStatCards = ({ invoices }: BillingStatCardsProps) => {
  const stats = [
    {
      label: "Total Invoices",
      count: invoices.length,
      icon: Receipt,
      color: "text-blue-600",
    },
    {
      label: "Paid",
      count: invoices.filter((i) => i.status === "paid").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending",
      count: invoices.filter((i) => i.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Overdue",
      count: invoices.filter((i) => i.status === "overdue").length,
      icon: DollarSign,
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
