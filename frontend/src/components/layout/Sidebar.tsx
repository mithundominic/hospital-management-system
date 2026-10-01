// Responsibility: Render primary desktop sidebar navigation with logo and active links

import { Box } from "@/components/ui/Box";
import { SidebarBrandHeader } from "./SidebarBrandHeader";
import { SidebarNavItem } from "./SidebarNavItem";
import { navigationItems } from "./sidebar.config";
import { platformNavigationItems } from "./sidebar.platform";
import { useAuth } from "@/contexts/AuthContext";
import { usePlatform } from "@/contexts";
import { useHospital } from "@/contexts/useHospital";

export const Sidebar = () => {
  const { user } = useAuth();
  const { isPlatformAdmin } = usePlatform();
  const { currentHospital } = useHospital();

  const isPlatformUser =
    isPlatformAdmin ||
    Boolean(
      user?.app_metadata?.is_platform_admin ||
      user?.app_metadata?.platform_role === "SuperAdmin" ||
      user?.app_metadata?.platform_role === "Support",
    );

  const isPlatformOnly = isPlatformUser && !currentHospital;

  return (
    <Box className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <Box className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <SidebarBrandHeader />

        <Box className="flex flex-1 flex-col">
          <Box className="flex flex-1 flex-col gap-y-1">
            {!isPlatformOnly &&
              navigationItems.map((item) => (
                <SidebarNavItem key={item.name} item={item} />
              ))}

            {isPlatformAdmin && (
              <Box
                className={
                  isPlatformOnly ? "mt-1" : "mt-4 pt-4 border-t border-gray-200"
                }
              >
                <Box className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Platform Admin
                </Box>
                {platformNavigationItems.map((item) => (
                  <SidebarNavItem key={item.name} item={item} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
