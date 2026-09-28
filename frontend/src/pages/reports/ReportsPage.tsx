// Responsibility: Container page for operational analytics, charts, and inventory stock reports

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { ReportsStatCards } from "./ReportsStatCards";
import { ReportsCharts } from "./ReportsCharts";
import { ReportsLowStockTable } from "./ReportsLowStockTable";
import type { BedOccupancy, RevenueData, LowStockItem } from "@/types";

export default function ReportsPage() {
  const { currentHospital } = useHospital();

  const { data: bedOccupancy } = useQuery<BedOccupancy | null>({
    queryKey: QUERY_KEYS.hospitals.reports.bedOccupancy(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return null;
      return api.get(API_ROUTES.hospitals.reports.bedOccupancy(currentHospital.id));
    },
    enabled: !!currentHospital,
  });

  const { data: revenue = [] } = useQuery<RevenueData[]>({
    queryKey: QUERY_KEYS.hospitals.reports.revenue(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return api.get(API_ROUTES.hospitals.reports.dailyRevenue(currentHospital.id));
    },
    enabled: !!currentHospital,
  });

  const { data: lowStock = [] } = useQuery<LowStockItem[]>({
    queryKey: QUERY_KEYS.hospitals.reports.lowStock(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return api.get(API_ROUTES.hospitals.reports.lowStock(currentHospital.id));
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="View hospital performance metrics and insights"
        action={
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        }
      />

      <ReportsStatCards
        bedOccupancy={bedOccupancy ?? null}
        revenue={revenue}
        lowStock={lowStock}
      />

      <ReportsCharts bedOccupancy={bedOccupancy ?? null} revenue={revenue} />

      <ReportsLowStockTable lowStock={lowStock} />
    </Box>
  );
}
