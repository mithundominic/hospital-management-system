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
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export const navigationItems: readonly NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Encounters', href: '/encounters', icon: FileText },
  { name: 'Lab Orders', href: '/lab', icon: TestTube },
  { name: 'Pharmacy', href: '/pharmacy', icon: Pill },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Insurance', href: '/insurance', icon: Shield },
  { name: 'IPD Management', href: '/ipd', icon: Bed },
  { name: 'Staff', href: '/staff', icon: UserCog },
  { name: 'Shifts', href: '/shifts', icon: Clock },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
] as const;
