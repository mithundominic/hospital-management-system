// Responsibility: Render status summary metric cards for lab orders

import { Clock, TestTube, CheckCircle, AlertCircle } from "lucide-react";
import {
  StatCardGrid,
  type StatItemConfig,
} from "@/components/common/StatCardGrid";
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

export const LabOrdersStatCards = ({ orders }: LabOrdersStatCardsProps) => {
  const stats: StatItemConfig[] = statusConfig.map((item) => ({
    key: item.key,
    label: item.label,
    value: orders.filter((o) => o.status === item.key).length,
    icon: item.icon,
    iconColor: item.color,
    cardPadding: "p-4",
  }));

  return <StatCardGrid stats={stats} cols={4} gap={4} />;
};

export default LabOrdersStatCards;
