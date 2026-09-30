// Responsibility: Platform admin navigation items

import { Building2, TrendingUp } from "lucide-react";
import { APP_ROUTES, PERMISSIONS } from "@/constants";
import type { NavItem } from "./sidebar.config";

export const platformNavigationItems: readonly NavItem[] = [
  {
    name: "Platform Hospitals",
    href: APP_ROUTES.PLATFORM_HOSPITALS,
    icon: Building2,
    permission: PERMISSIONS.PLATFORM_MANAGE_HOSPITALS,
  },
  {
    name: "Platform Analytics",
    href: APP_ROUTES.PLATFORM_ANALYTICS,
    icon: TrendingUp,
    permission: PERMISSIONS.PLATFORM_SUPPORT_ACCESS,
  },
] as const;
