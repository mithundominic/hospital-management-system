// Responsibility: Configuration for platform dashboard stat cards and metrics
 
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
} from "lucide-react";
import type { PlatformAnalytics, PlatformHospital } from "@/types/platform";
import type { TableColumn } from "@/types/table.types";

export interface PlatformStatConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  getValue: (analytics: PlatformAnalytics | undefined) => number | string;
}

export const PLATFORM_STATS: readonly PlatformStatConfig[] = [
  {
    id: "total",
    label: "Total Hospitals",
    icon: Building2,
    color: "text-blue-600",
    getValue: (analytics) => analytics?.total_hospitals || 0,
  },
  {
    id: "active",
    label: "Active Hospitals",
    icon: CheckCircle,
    color: "text-green-600",
    getValue: (analytics) => analytics?.active_hospitals || 0,
  },
  {
    id: "inactive",
    label: "Inactive Hospitals",
    icon: XCircle,
    color: "text-red-600",
    getValue: (analytics) => analytics?.inactive_hospitals || 0,
  },
  {
    id: "staff",
    label: "Total Staff",
    icon: UserCheck,
    color: "text-purple-600",
    getValue: (analytics) => analytics?.total_staff || 0,
  },
  {
    id: "patients",
    label: "Total Patients",
    icon: Users,
    color: "text-indigo-600",
    getValue: (analytics) => analytics?.total_patients || 0,
  },
] as const;

export const HOSPITALS_TABLE_COLUMNS: readonly TableColumn<PlatformHospital>[] = [
  { key: "name", header: "Hospital Name" },
  { key: "city", header: "City" },
  { key: "registration", header: "Registration" },
  { key: "patient_count" as keyof PlatformHospital, header: "Patients", className: "text-center" },
  { key: "staff_count" as keyof PlatformHospital, header: "Staff", className: "text-center" },
  { key: "status", header: "Status" },
  { key: "onboarded", header: "Onboarded" },
  { key: "actions", header: "Actions" },
] as const;
