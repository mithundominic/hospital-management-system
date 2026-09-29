// Responsibility: Reports domain service for fetching hospital operational analytics

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { BedOccupancy, RevenueData, LowStockItem } from "@/types";

export const getBedOccupancyReport = async (
  hospitalId: string,
): Promise<BedOccupancy | null> => {
  return await api.get<BedOccupancy>(
    API_ROUTES.hospitals.reports.bedOccupancy(hospitalId),
  );
};

export const getDailyRevenueReport = async (
  hospitalId: string,
): Promise<RevenueData[]> => {
  return await api.get<RevenueData[]>(
    API_ROUTES.hospitals.reports.dailyRevenue(hospitalId),
  );
};

export const getLowStockReport = async (
  hospitalId: string,
): Promise<LowStockItem[]> => {
  return await api.get<LowStockItem[]>(
    API_ROUTES.hospitals.reports.lowStock(hospitalId),
  );
};
