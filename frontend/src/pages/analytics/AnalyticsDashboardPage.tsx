// Responsibility: Main analytics dashboard page with tabs and date range selection

import { useState } from "react";
import { Box } from "@/components/ui/Box";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { useHospital } from "@/contexts/useHospital";
import { OverviewTab } from "./components/OverviewTab";
import { FinancialTab } from "./components/FinancialTab";
import { OperationalTab } from "./components/OperationalTab";
import { ClinicalTab } from "./components/ClinicalTab";
import { InventoryTab } from "./components/InventoryTab";
import { ANALYTICS_TABS, DATE_RANGE_PRESETS } from "./analytics.config";
import { DateRange, AnalyticsCategory } from "./analytics.types";

export default function AnalyticsDashboardPage() {
  const { currentHospital } = useHospital();
  const [activeTab, setActiveTab] = useState<AnalyticsCategory>("overview");
  const [selectedPreset, setSelectedPreset] = useState("last30days");
  const [dateRange, setDateRange] = useState<DateRange>(
    DATE_RANGE_PRESETS[1].getValue(),
  );

  const renderTabContent = () => {
    if (!currentHospital?.id) return null;

    const props = {
      hospitalId: currentHospital.id,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };

    switch (activeTab) {
      case "overview":
        return <OverviewTab {...props} />;
      case "financial":
        return <FinancialTab {...props} />;
      case "operational":
        return <OperationalTab {...props} />;
      case "clinical":
        return <ClinicalTab {...props} />;
      case "inventory":
        return <InventoryTab {...props} />;
      default:
        return null;
    }
  };

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="View hospital performance metrics and insights"
      />

      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        selectedPreset={selectedPreset}
        onPresetChange={setSelectedPreset}
      />

      <Tabs
        items={ANALYTICS_TABS as unknown as TabItem<AnalyticsCategory>[]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as AnalyticsCategory)}
      />

      <Box className="mt-6">{renderTabContent()}</Box>
    </Box>
  );
}
