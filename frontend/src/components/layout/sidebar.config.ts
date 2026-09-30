// Responsibility: Navigation configuration and item definitions for the app sidebar
 
import type { LucideIcon } from "lucide-react";
import type { PermissionKey } from "@/constants";
import { navigationItems } from "./sidebar.data";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: PermissionKey;
}

export { navigationItems };
