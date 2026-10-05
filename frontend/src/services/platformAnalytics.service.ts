// Responsibility: Platform analytics API calls

import { api } from "@/lib/api";

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface HospitalComparison {
  hospital_id: string;
  hospital_name: string;
  patient_count: number;
  staff_count: number;
  appointments_count: number;
  revenue: number;
}

interface StaffDistribution {
  role: string;
  count: number;
}

export const platformAnalyticsService = {
  getRevenueTimeSeries: (params?: {
    start?: string;
    end?: string;
    groupBy?: "day" | "week" | "month";
  }) => {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return api.get<RevenueDataPoint[]>(
      `/platform/analytics/revenue-timeseries?${queryParams}`,
    );
  },

  getHospitalComparison: () =>
    api.get<HospitalComparison[]>("/platform/analytics/hospital-comparison"),

  getStaffDistribution: () =>
    api.get<StaffDistribution[]>("/platform/analytics/staff-distribution"),
};
