// Responsibility: Static navigation item definitions for app sidebar layout

import {
  Receipt,
  Shield,
  Clock,
  Calendar,
  UserCog,
  BarChart3,
  Settings,
  Fingerprint,
} from "lucide-react";
import { APP_ROUTES, PERMISSIONS } from "@/constants";
import type { NavItem } from "./sidebar.config";
import { clinicalNavItems } from "./sidebar.clinical.data";

const operationalNavItems: readonly NavItem[] = [
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
    name: "Attendance",
    href: APP_ROUTES.ATTENDANCE,
    icon: Clock,
    permission: PERMISSIONS.ATTENDANCE_WRITE,
  },
  {
    name: "Leave",
    href: APP_ROUTES.LEAVE,
    icon: Calendar,
    permission: PERMISSIONS.LEAVE_WRITE,
  },
  {
    name: "Biometric Devices",
    href: APP_ROUTES.BIOMETRIC_DEVICES,
    icon: Fingerprint,
    permission: PERMISSIONS.DEVICES_MANAGE,
  },
  {
    name: "Analytics",
    href: APP_ROUTES.ANALYTICS,
    icon: BarChart3,
    permission: PERMISSIONS.ANALYTICS_READ,
  },
  {
    name: "Reports",
    href: APP_ROUTES.REPORTS,
    icon: BarChart3,
    permission: PERMISSIONS.REPORTS_READ,
  },
  {
    name: "Hospital Settings",
    href: APP_ROUTES.SETTINGS,
    icon: Settings,
    permission: PERMISSIONS.HOSPITAL_MANAGE,
  },
] as const;

export const navigationItems: readonly NavItem[] = [
  ...clinicalNavItems,
  ...operationalNavItems,
];
