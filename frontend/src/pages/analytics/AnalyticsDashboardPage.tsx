// Responsibility: Main analytics dashboard page with tabs and date range selection

import { useState, lazy, Suspense, type ComponentType } from "react";
import { Box } from "@/components/ui/Box";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { useHospital } from "@/contexts/useHospital";
import { ANALYTICS_TABS, DATE_RANGE_PRESETS } from "./analytics.config";
import { DateRange, AnalyticsCategory } from "./analytics.types";

const OverviewTab = lazy(() =>
  import("./components/OverviewTab").then((m) => ({ default: m.OverviewTab })),
);
const FinancialTab = lazy(() =>
  import("./components/FinancialTab").then((m) => ({ default: m.FinancialTab })),
);
const OperationalTab = lazy(() =>
  import("./components/OperationalTab").then((m) => ({ default: m.OperationalTab })),
);
const ClinicalTab = lazy(() =>
  import("./components/ClinicalTab").then((m) => ({ default: m.ClinicalTab })),
);
const InventoryTab = lazy(() =>
  import("./components/InventoryTab").then((m) => ({ default: m.InventoryTab })),
);

interface TabProps {
  hospitalId: string;
  startDate: string;
  endDate: string;
}

const TAB_COMPONENTS: Record<AnalyticsCategory, ComponentType<TabProps>> = {
  overview: OverviewTab,
  financial: FinancialTab,
  operational: OperationalTab,
  clinical: ClinicalTab,
  inventory: InventoryTab,
};

export default function AnalyticsDashboardPage() {
  const { currentHospital } = useHospital();
  const [activeTab, setActiveTab] = useState<AnalyticsCategory>("overview");
  const [selectedPreset, setSelectedPreset] = useState("last30days");
  const [dateRange, setDateRange] = useState<DateRange>(
    DATE_RANGE_PRESETS[1].getValue(),
  );

  const renderTabContent = () => {
    if (!currentHospital?.id) return null;

    const TabComponent = TAB_COMPONENTS[activeTab];
    const props = {
      hospitalId: currentHospital.id,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };

    return (
      <Suspense fallback={null}>
        <TabComponent {...props} />
      </Suspense>
    );
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
