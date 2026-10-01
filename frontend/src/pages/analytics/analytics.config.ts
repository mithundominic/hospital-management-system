// Responsibility: Configuration objects for analytics dashboard

import { subDays, subMonths, format } from "date-fns";
import type { TabItem } from "@/components/ui/Tabs";
import type { DateRangePreset, AnalyticsCategory } from "./analytics.types";

export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    id: "last7days",
    label: "Last 7 days",
    getValue: () => ({
      startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    }),
  },
  {
    id: "last30days",
    label: "Last 30 days",
    getValue: () => ({
      startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    }),
  },
  {
    id: "last3months",
    label: "Last 3 months",
    getValue: () => ({
      startDate: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    }),
  },
  {
    id: "last12months",
    label: "Last 12 months",
    getValue: () => ({
      startDate: format(subMonths(new Date(), 12), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    }),
  },
  {
    id: "custom",
    label: "Custom",
    getValue: () => ({
      startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    }),
  },
];

export const ANALYTICS_TABS: TabItem<AnalyticsCategory>[] = [
  { id: "overview", label: "Overview" },
  { id: "financial", label: "Financial" },
  { id: "operational", label: "Operational" },
  { id: "clinical", label: "Clinical" },
  { id: "inventory", label: "Inventory" },
];

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  purple: "#a855f7",
  pink: "#ec4899",
};

export const STATUS_COLORS: Record<string, string> = {
  scheduled: CHART_COLORS.info,
  completed: CHART_COLORS.success,
  cancelled: CHART_COLORS.danger,
  "no-show": CHART_COLORS.warning,
};
