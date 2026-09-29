// Responsibility: Dashboard navigation tabs and view component configuration mapping

import type { ComponentType } from "react";
import { BarChart3, BellRing } from "lucide-react";
import type { TabItem } from "@/components/ui/Tabs";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardPanels } from "./DashboardPanels";
import { dashboardAlerts } from "./dashboard.data";

export type DashboardTabId = "analytics" | "activity";

export const DASHBOARD_TABS: readonly TabItem<DashboardTabId>[] = [
  {
    id: "analytics",
    label: "Analytics & Charts",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "activity",
    label: "Activity & Alerts",
    icon: <BellRing className="h-4 w-4" />,
    count: dashboardAlerts.length,
  },
] as const;

export const DASHBOARD_TAB_COMPONENTS: Record<DashboardTabId, ComponentType> = {
  analytics: DashboardCharts,
  activity: DashboardPanels,
} as const;
