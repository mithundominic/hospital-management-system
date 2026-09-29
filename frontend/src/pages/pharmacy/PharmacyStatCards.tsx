// Responsibility: Render inventory summary metric cards for total items and stock health

import { Pill, TrendingDown, Package } from "lucide-react";
import {
  StatCardGrid,
  type StatItemConfig,
} from "@/components/common/StatCardGrid";

export interface PharmacyStatCardsProps {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
}

export const PharmacyStatCards = ({
  totalItems,
  lowStockCount,
  totalValue,
}: PharmacyStatCardsProps) => {
  const stats: StatItemConfig[] = [
    {
      label: "Total Items",
      value: totalItems,
      icon: Pill,
      iconColor: "text-blue-600",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      valueColor: "text-red-600",
      icon: TrendingDown,
      iconColor: "text-red-600",
    },
    {
      label: "Estimated Value",
      value: `₹${totalValue.toLocaleString("en-IN")}`,
      icon: Package,
      iconColor: "text-green-600",
    },
  ];

  return <StatCardGrid stats={stats} cols={3} gap={6} />;
};

export default PharmacyStatCards;
