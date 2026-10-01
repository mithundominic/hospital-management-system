// Responsibility: Render a single sidebar navigation link with active state styling

import { NavLink } from "react-router-dom";
import type { NavItem } from "./sidebar.config";
import { APP_ROUTES } from "@/constants";

interface SidebarNavItemProps {
  item: NavItem;
}

export const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      end={item.href === APP_ROUTES.DASHBOARD}
      className={({ isActive }) =>
        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
          isActive
            ? "bg-primary-50 text-primary-700"
            : "text-gray-700 hover:text-primary-700 hover:bg-gray-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`h-5 w-5 shrink-0 ${
              isActive
                ? "text-primary-700"
                : "text-gray-400 group-hover:text-primary-700"
            }`}
          />
          {item.name}
        </>
      )}
    </NavLink>
  );
};
