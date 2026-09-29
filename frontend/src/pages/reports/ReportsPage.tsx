// Responsibility: Container page for operational analytics, charts, and inventory stock reports

import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { ReportsStatCards } from "./ReportsStatCards";
import { ReportsCharts } from "./ReportsCharts";
import { ReportsLowStockTable } from "./ReportsLowStockTable";
import { buildReportsTabs, type ReportsTabId } from "./reports.config";
import { useReportsPage } from "./useReportsPage";

export default function ReportsPage() {
  const { bedOccupancy, revenue, lowStock, activeTab, setActiveTab } =
    useReportsPage();

  const tabs = buildReportsTabs(lowStock.length);

  const tabContent: Record<ReportsTabId, ReactNode> = {
    charts: <ReportsCharts bedOccupancy={bedOccupancy} revenue={revenue} />,
    low_stock: <ReportsLowStockTable lowStock={lowStock} />,
  };

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
        bedOccupancy={bedOccupancy}
        revenue={revenue}
        lowStock={lowStock}
      />

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        {tabContent[activeTab]}
      </Box>
    </Box>
  );
}
