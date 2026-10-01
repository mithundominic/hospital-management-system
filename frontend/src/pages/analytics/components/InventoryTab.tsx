// Responsibility: Inventory analytics tab with stock movement insights

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAnalytics } from "../hooks/useAnalytics";
import { InventoryAnalytics } from "../analytics.types";
import { FastMovingTable } from "./FastMovingTable";
import { SlowMovingTable } from "./SlowMovingTable";
import { LowStockAlertsTable } from "./LowStockAlertsTable";

interface InventoryTabProps {
  hospitalId: string;
  startDate: string;
  endDate: string;
}

export const InventoryTab = ({
  hospitalId,
  startDate,
  endDate,
}: InventoryTabProps) => {
  const { data, isLoading } = useAnalytics<InventoryAnalytics>(
    hospitalId,
    "inventory",
    startDate,
    endDate,
  );

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!data) return null;

  return (
    <Box className="space-y-6">
      <Card className="p-6">
        <Heading level={3} className="mb-2">
          Total Stock Units
        </Heading>
        <Box className="text-3xl font-bold text-primary-600">
          {data.total_stock_units.toLocaleString()}
        </Box>
      </Card>

      <Grid cols={2} gap={6}>
        <FastMovingTable items={data.fast_moving_items} />
        <SlowMovingTable items={data.slow_moving_items} />
      </Grid>

      <LowStockAlertsTable alerts={data.low_stock_alerts} />
    </Box>
  );
};
