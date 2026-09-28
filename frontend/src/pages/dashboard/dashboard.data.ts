// Responsibility: Static dataset definitions and configurations for dashboard charts and metrics

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  occupiedBeds: number;
  totalBeds: number;
  pendingBills: number;
  todayRevenue: number;
}

export interface WeeklyRevenueItem {
  name: string;
  revenue: number;
}

export interface TodayAppointmentItem {
  name: string;
  count: number;
}

export const defaultStats: DashboardStats = {
  totalPatients: 1247,
  todayAppointments: 32,
  occupiedBeds: 45,
  totalBeds: 60,
  pendingBills: 18,
  todayRevenue: 125000,
};

export const weeklyRevenueData: WeeklyRevenueItem[] = [
  { name: "Mon", revenue: 45000 },
  { name: "Tue", revenue: 52000 },
  { name: "Wed", revenue: 48000 },
  { name: "Thu", revenue: 61000 },
  { name: "Fri", revenue: 55000 },
  { name: "Sat", revenue: 67000 },
  { name: "Sun", revenue: 42000 },
];

export const todayAppointmentData: TodayAppointmentItem[] = [
  { name: "8 AM", count: 5 },
  { name: "10 AM", count: 8 },
  { name: "12 PM", count: 12 },
  { name: "2 PM", count: 10 },
  { name: "4 PM", count: 7 },
  { name: "6 PM", count: 4 },
];

export const recentActivities = [
  {
    action: "New patient registered",
    time: "5 minutes ago",
    patient: "John Doe",
  },
  {
    action: "Lab result updated",
    time: "15 minutes ago",
    patient: "Jane Smith",
  },
  {
    action: "Invoice generated",
    time: "1 hour ago",
    patient: "Robert Johnson",
  },
  { action: "Patient discharged", time: "2 hours ago", patient: "Emily Davis" },
] as const;

export const dashboardAlerts = [
  {
    message: "Paracetamol stock is below reorder level (15 remaining)",
    type: "warning" as const,
  },
  {
    message: "3 lab results pending review for >24 hours",
    type: "urgent" as const,
  },
  { message: "Bed occupancy reached 75%", type: "info" as const },
] as const;
