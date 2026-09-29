// Responsibility: Render inpatient bed occupancy metrics and capacity summary

import { Bed, User, CheckCircle, AlertTriangle } from "lucide-react";
import {
  StatCardGrid,
  type StatItemConfig,
} from "@/components/common/StatCardGrid";
import type { Bed as BedType } from "@/types";

export interface IPDStatCardsProps {
  beds: BedType[];
}

export const IPDStatCards = ({ beds }: IPDStatCardsProps) => {
  const total = beds.length;
  const occupied = beds.filter((b) => b.status === "occupied").length;
  const available = beds.filter((b) => b.status === "available").length;
  const maintenance = beds.filter((b) => b.status === "maintenance").length;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const stats: StatItemConfig[] = [
    {
      label: "Total Beds",
      value: total,
      icon: Bed,
      iconColor: "text-blue-600",
      cardPadding: "p-4",
    },
    {
      label: "Occupied",
      value: occupied,
      valueColor: "text-red-600",
      subtext: `${occupancyRate}% occupancy`,
      icon: User,
      iconColor: "text-red-600",
      cardPadding: "p-4",
    },
    {
      label: "Available",
      value: available,
      valueColor: "text-green-600",
      icon: CheckCircle,
      iconColor: "text-green-600",
      cardPadding: "p-4",
    },
    {
      label: "Maintenance",
      value: maintenance,
      valueColor: "text-yellow-600",
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      cardPadding: "p-4",
    },
  ];

  return <StatCardGrid stats={stats} cols={4} gap={6} />;
};

export default IPDStatCards;
