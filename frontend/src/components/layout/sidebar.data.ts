// Responsibility: Static navigation item definitions for app sidebar layout

import {
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
  Settings,
  Fingerprint,
} from "lucide-react";
import { APP_ROUTES, PERMISSIONS } from "@/constants";
import type { NavItem } from "./sidebar.config";

export const navigationItems: readonly NavItem[] = [
  { name: "Dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Patients", href: APP_ROUTES.PATIENTS, icon: Users, permission: PERMISSIONS.PATIENTS_READ },
  { name: "Appointments", href: APP_ROUTES.APPOINTMENTS, icon: Calendar, permission: PERMISSIONS.APPOINTMENTS_READ },
  { name: "Encounters", href: APP_ROUTES.ENCOUNTERS, icon: FileText, permission: PERMISSIONS.ENCOUNTERS_READ },
  { name: "Lab Orders", href: APP_ROUTES.LAB_ORDERS, icon: TestTube, permission: PERMISSIONS.LAB_ORDERS_READ },
  { name: "Pharmacy", href: APP_ROUTES.PHARMACY, icon: Pill, permission: PERMISSIONS.INVENTORY_READ },
  { name: "Billing", href: APP_ROUTES.BILLING, icon: Receipt, permission: PERMISSIONS.BILLING_READ },
  { name: "Insurance", href: APP_ROUTES.INSURANCE, icon: Shield, permission: PERMISSIONS.INSURANCE_CLAIMS_READ },
  { name: "IPD Management", href: APP_ROUTES.IPD, icon: Bed, permission: PERMISSIONS.BEDS_READ },
  { name: "Staff", href: APP_ROUTES.STAFF, icon: UserCog, permission: PERMISSIONS.MEMBERSHIPS_MANAGE },
  { name: "Shifts", href: APP_ROUTES.SHIFTS, icon: Clock, permission: PERMISSIONS.SHIFTS_READ },
  { name: "Attendance", href: APP_ROUTES.ATTENDANCE, icon: Clock, permission: PERMISSIONS.ATTENDANCE_WRITE },
  { name: "Leave", href: APP_ROUTES.LEAVE, icon: Calendar, permission: PERMISSIONS.LEAVE_WRITE },
  { name: "Biometric Devices", href: APP_ROUTES.BIOMETRIC_DEVICES, icon: Fingerprint, permission: PERMISSIONS.DEVICES_MANAGE },
  { name: "Reports", href: APP_ROUTES.REPORTS, icon: BarChart3, permission: PERMISSIONS.REPORTS_READ },
  { name: "Hospital Settings", href: APP_ROUTES.SETTINGS, icon: Settings, permission: PERMISSIONS.HOSPITAL_MANAGE },
] as const;
