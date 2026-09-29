// Responsibility: Render operational KPI summary cards for occupancy, revenue, and stock alerts

import { Bed, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import {
  StatCardGrid,
  type StatItemConfig,
} from "@/components/common/StatCardGrid";
import type { BedOccupancy, RevenueData, LowStockItem } from "@/types";

export interface ReportsStatCardsProps {
  bedOccupancy: BedOccupancy | null;
  revenue: RevenueData[];
  lowStock: LowStockItem[];
}

export const ReportsStatCards = ({
  bedOccupancy,
  revenue,
  lowStock,
}: ReportsStatCardsProps) => {
  const occRate = bedOccupancy?.total_beds
    ? Math.round((bedOccupancy.occupied_beds / bedOccupancy.total_beds) * 100)
    : 0;
  const todayRev = revenue[0]?.total_amount || 0;

  const stats: StatItemConfig[] = [
    {
      label: "Bed Occupancy",
      value: `${occRate}%`,
      subtext: `${bedOccupancy?.occupied_beds || 0} / ${bedOccupancy?.total_beds || 0} beds`,
      icon: Bed,
      iconColor: "text-purple-600",
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRev.toLocaleString("en-IN")}`,
      subtext: (
        <Flex align="center" gap={1} className="text-green-600">
          <TrendingUp className="h-4 w-4" />
          <Text size="xs" className="text-green-600">
            +12% from yesterday
          </Text>
        </Flex>
      ),
      icon: DollarSign,
      iconColor: "text-green-600",
    },
    {
      label: "Low Stock Items",
      value: lowStock.length,
      valueColor: "text-amber-600",
      subtext: "Requires immediate attention",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
    },
  ];

  return <StatCardGrid stats={stats} cols={3} gap={6} />;
};

export default ReportsStatCards;
