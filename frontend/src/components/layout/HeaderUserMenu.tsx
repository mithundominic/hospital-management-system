// Responsibility: Render user profile avatar, details, and sign out dropdown menu

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export const HeaderUserMenu = () => {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

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
        <Box className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          <Box className="px-4 py-2 border-b border-gray-200">
            <Text size="sm" weight="medium">
              {user?.email}
            </Text>
          </Box>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="w-full justify-start px-4 py-2 text-red-600 hover:text-red-700"
          >
            Sign out
          </Button>
        </Box>
      )}
    </Box>
  );
};
