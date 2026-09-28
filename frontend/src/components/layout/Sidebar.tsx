// Responsibility: Render primary desktop sidebar navigation with logo and active links

import { NavLink } from "react-router-dom";
import { Hospital } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { navigationItems } from "./sidebar.config";

export const Sidebar = () => {
  return (
    <Box className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <Box className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <Flex align="center" gap={3} className="h-16 shrink-0">
          <Hospital className="h-8 w-8 text-primary-600" />
          <Box>
            <Heading level={1} className="text-xl font-bold text-gray-900">
              HealthCare
            </Heading>
            <Text variant="caption">Hospital Management</Text>
          </Box>
        </Flex>

        <Box className="flex flex-1 flex-col">
          <Box className="flex flex-1 flex-col gap-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
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
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
