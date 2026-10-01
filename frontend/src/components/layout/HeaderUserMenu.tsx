// Responsibility: Render user profile avatar, details, public homepage link, and sign out dropdown menu

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Globe, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHospital } from "@/contexts/useHospital";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { APP_ROUTES } from "@/constants";

export const HeaderUserMenu = () => {
  const { user, signOut } = useAuth();
  const { currentHospital } = useHospital();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <Box className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-1"
      >
        <Flex
          align="center"
          justify="center"
          className="h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-medium"
        >
          {user?.email?.charAt(0).toUpperCase()}
        </Flex>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </Button>

      {showMenu && (
        <Box className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          <Box className="px-4 py-2 border-b border-gray-200">
            <Text size="sm" weight="medium">
              {user?.email}
            </Text>
          </Box>
          {currentHospital && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowMenu(false);
                navigate(APP_ROUTES.SETTINGS);
              }}
              className="w-full justify-start px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <Settings className="h-4 w-4 text-gray-500" />
              Hospital Settings
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowMenu(false);
              navigate(APP_ROUTES.HOME);
            }}
            className="w-full justify-start px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center gap-2"
          >
            <Globe className="h-4 w-4 text-gray-500" />
            Public Homepage
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="w-full justify-start px-4 py-2 text-red-600 hover:text-red-700 border-t border-gray-100 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </Box>
      )}
    </Box>
  );
};
