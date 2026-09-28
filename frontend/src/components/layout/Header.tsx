// Responsibility: Top navigation bar rendering search, hospital switcher, notifications, and profile menu

import { useState } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHospital } from '@/contexts/HospitalContext';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { hospitals, currentHospital, setCurrentHospital } = useHospital();
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            {hospitals.length > 1 && (
              <Box className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHospitalMenu(!showHospitalMenu)}
                  className="flex items-center gap-2"
                >
                  <Text size="sm">{currentHospital?.name || 'Select Hospital'}</Text>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {showHospitalMenu && (
                  <Box className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {hospitals.map((h) => (
                      <Button
                        key={h.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentHospital(h);
                          setShowHospitalMenu(false);
                        }}
                        className="w-full justify-start text-left px-4 py-2"
                      >
                        {h.name}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <Box className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <Box className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1"
              >
                <Flex align="center" justify="center" className="h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </Flex>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Button>

              {showUserMenu && (
                <Box className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <Box className="px-4 py-2 border-b border-gray-200">
                    <Text size="sm" weight="medium">{user?.email}</Text>
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
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
