// Responsibility: Render status summary metric cards for lab orders

import { Clock, TestTube, CheckCircle, AlertCircle } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatCard } from "@/components/common/StatCard";
import type { LabOrder } from "@/types";

export interface LabOrdersStatCardsProps {
  orders: LabOrder[];
}

const statusConfig = [
  { key: "pending", label: "Pending", icon: Clock, color: "text-yellow-600" },
  {
    key: "in_progress",
    label: "In Progress",
    icon: TestTube,
    color: "text-blue-600",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: AlertCircle,
    color: "text-red-600",
  },
] as const;

export const LabOrdersStatCards = ({ orders }: LabOrdersStatCardsProps) => (
  <Grid cols={4} gap={4}>
    {statusConfig.map((item) => {
      const count = orders.filter((o) => o.status === item.key).length;
      return (
        <StatCard
          key={item.key}
          label={item.label}
          value={count}
          icon={item.icon}
          iconColor={item.color}
          cardPadding="p-4"
        />
      );
    })}
  </Grid>
);
