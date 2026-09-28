// Responsibility: Render inventory summary metric cards for total items and stock health

import { Pill, TrendingDown, Package } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { StatCard } from "@/components/common/StatCard";

export interface PharmacyStatCardsProps {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
}

export const PharmacyStatCards = ({
  totalItems,
  lowStockCount,
  totalValue,
}: PharmacyStatCardsProps) => (
  <Grid cols={3} gap={6}>
    <StatCard
      label="Total Items"
      value={totalItems}
      icon={Pill}
      iconColor="text-blue-600"
    />
    <StatCard
      label="Low Stock Items"
      value={lowStockCount}
      valueColor="text-red-600"
      icon={TrendingDown}
      iconColor="text-red-600"
    />
    <StatCard
      label="Estimated Value"
      value={`₹${totalValue.toLocaleString("en-IN")}`}
      icon={Package}
      iconColor="text-green-600"
    />
  </Grid>
);
