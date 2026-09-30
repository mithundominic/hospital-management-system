// Responsibility: Top navigation bar rendering search, hospital switcher, and notification controls

import { Bell, Search } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { HospitalSwitcher } from "./HospitalSwitcher";

export const Header = () => {
  return (
    <Box className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <Box className="px-4 sm:px-6 lg:px-8">
        <Flex align="center" justify="between" className="h-16">
          <Box className="flex-1 max-w-lg">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Search patients, appointments..."
            />
          </Box>

          <Flex align="center" gap={4}>
            <HospitalSwitcher />

            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <Box className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <HeaderUserMenu />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
