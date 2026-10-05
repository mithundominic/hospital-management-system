// Responsibility: Render active hospital tenant or platform administration brand header in sidebar

import { useAuth } from "@/contexts/useAuth";
import { useHospital } from "@/contexts/useHospital";
import { usePlatform } from "@/contexts";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HospitalBrandLogo } from "./HospitalBrandLogo";

export const SidebarBrandHeader = () => {
  const { user } = useAuth();
  const { currentHospital } = useHospital();
  const { isPlatformAdmin } = usePlatform();

  const isPlatformUser =
    isPlatformAdmin ||
    Boolean(
      user?.app_metadata?.is_platform_admin ||
      user?.app_metadata?.platform_role === "SuperAdmin" ||
      user?.app_metadata?.platform_role === "Support",
    );

  const isPlatformMode = isPlatformUser && !currentHospital;

  const brandName = isPlatformMode
    ? "HealthCare Platform"
    : currentHospital?.name || "HealthCare";

  const subtitle = isPlatformMode
    ? "Platform Administration"
    : currentHospital?.city
      ? [currentHospital.city, currentHospital.state].filter(Boolean).join(", ")
      : "Hospital Management";

  return (
    <Flex
      align="center"
      gap={3}
      className="h-16 shrink-0 border-b border-gray-100"
    >
      <HospitalBrandLogo
        logoUrl={isPlatformMode ? undefined : currentHospital?.logo_url}
        name={brandName}
        size="md"
      />
      <Box className="min-w-0 flex-1" title={brandName}>
        <Heading
          level={1}
          className="text-base font-bold text-gray-900 truncate"
        >
          {brandName}
        </Heading>
        <Text variant="caption" className="truncate text-gray-500 block">
          {subtitle}
        </Text>
      </Box>
    </Flex>
  );
};
