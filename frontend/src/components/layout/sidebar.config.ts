// Responsibility: Navigation configuration and item definitions for the app sidebar

import {
  type LucideIcon,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  TestTube,
  Pill,
  Receipt,
  Shield,
  Bed,
  Clock,
  UserCog,
  BarChart3,
} from "lucide-react";
import { APP_ROUTES, PERMISSIONS, type PermissionKey } from "@/constants";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: PermissionKey;
}

export const navigationItems: readonly NavItem[] = [
  { name: "Dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
  {
    name: "Patients",
    href: APP_ROUTES.PATIENTS,
    icon: Users,
    permission: PERMISSIONS.PATIENTS_READ,
  },
  {
    name: "Appointments",
    href: APP_ROUTES.APPOINTMENTS,
    icon: Calendar,
    permission: PERMISSIONS.APPOINTMENTS_READ,
  },
  {
    name: "Encounters",
    href: APP_ROUTES.ENCOUNTERS,
    icon: FileText,
    permission: PERMISSIONS.ENCOUNTERS_READ,
  },
  {
    name: "Lab Orders",
    href: APP_ROUTES.LAB_ORDERS,
    icon: TestTube,
    permission: PERMISSIONS.LAB_ORDERS_READ,
  },
  {
    name: "Pharmacy",
    href: APP_ROUTES.PHARMACY,
    icon: Pill,
    permission: PERMISSIONS.INVENTORY_READ,
  },
  {
    name: "Billing",
    href: APP_ROUTES.BILLING,
    icon: Receipt,
    permission: PERMISSIONS.BILLING_READ,
  },
  {
    name: "Insurance",
    href: APP_ROUTES.INSURANCE,
    icon: Shield,
    permission: PERMISSIONS.INSURANCE_CLAIMS_READ,
  },
  {
    name: "IPD Management",
    href: APP_ROUTES.IPD,
    icon: Bed,
    permission: PERMISSIONS.BEDS_READ,
  },
  {
    name: "Staff",
    href: APP_ROUTES.STAFF,
    icon: UserCog,
    permission: PERMISSIONS.MEMBERSHIPS_MANAGE,
  },
  {
    name: "Shifts",
    href: APP_ROUTES.SHIFTS,
    icon: Clock,
    permission: PERMISSIONS.SHIFTS_READ,
  },
  {
    name: "Reports",
    href: APP_ROUTES.REPORTS,
    icon: BarChart3,
    permission: PERMISSIONS.REPORTS_READ,
  },
] as const;
