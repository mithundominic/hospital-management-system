// Responsibility: Manage operational reports data queries, analytics, and active tab state

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import {
  getBedOccupancyReport,
  getDailyRevenueReport,
  getLowStockReport,
} from "@/services/reports.service";
import { QUERY_KEYS } from "@/constants";
import type { BedOccupancy, RevenueData, LowStockItem } from "@/types";
import type { ReportsTabId } from "./reports.config";

export const useReportsPage = () => {
  const { currentHospital } = useHospital();
  const [activeTab, setActiveTab] = useState<ReportsTabId>("charts");

  const { data: bedOccupancy } = useQuery<BedOccupancy | null>({
    queryKey: QUERY_KEYS.hospitals.reports.bedOccupancy(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return null;
      return await getBedOccupancyReport(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const { data: revenue = [] } = useQuery<RevenueData[]>({
    queryKey: QUERY_KEYS.hospitals.reports.revenue(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getDailyRevenueReport(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const { data: lowStock = [] } = useQuery<LowStockItem[]>({
    queryKey: QUERY_KEYS.hospitals.reports.lowStock(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getLowStockReport(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  return {
    bedOccupancy: bedOccupancy ?? null,
    revenue,
    lowStock,
    activeTab,
    setActiveTab,
  } as const;
};
