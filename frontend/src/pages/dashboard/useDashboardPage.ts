// Responsibility: Manage dashboard overview metrics query and active tab state

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { QUERY_KEYS } from "@/constants";
import { defaultStats, type DashboardStats } from "./dashboard.data";
import type { DashboardTabId } from "./dashboard.config";

export const useDashboardPage = () => {
  const { currentHospital } = useHospital();
  const [activeTab, setActiveTab] = useState<DashboardTabId>("analytics");

  const { data: stats = defaultStats, isLoading } = useQuery<DashboardStats>({
    queryKey: QUERY_KEYS.hospitals.dashboardStats(currentHospital?.id),
    queryFn: async () => defaultStats,
    enabled: !!currentHospital,
  });

  return {
    stats,
    isLoading,
    activeTab,
    setActiveTab,
  } as const;
};
