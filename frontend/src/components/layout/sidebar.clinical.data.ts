// Responsibility: Clinical and core patient workflow navigation items for sidebar

import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  TestTube,
  Pill,
  Bed,
} from "lucide-react";
import { APP_ROUTES, PERMISSIONS } from "@/constants";
import type { NavItem } from "./sidebar.config";

export const clinicalNavItems: readonly NavItem[] = [
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
    name: "IPD Management",
    href: APP_ROUTES.IPD,
    icon: Bed,
    permission: PERMISSIONS.BEDS_READ,
  },
] as const;
