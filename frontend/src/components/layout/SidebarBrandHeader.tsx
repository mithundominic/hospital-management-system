// Responsibility: Render the active hospital tenant brand header and location in sidebar

import { useHospital } from "@/contexts/useHospital";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HospitalBrandLogo } from "./HospitalBrandLogo";

export const SidebarBrandHeader = () => {
  const { currentHospital } = useHospital();

  const locationSubtitle = currentHospital?.city
    ? [currentHospital.city, currentHospital.state].filter(Boolean).join(", ")
    : "Hospital Management";

  return (
    <Flex align="center" gap={3} className="h-16 shrink-0 border-b border-gray-100">
      <HospitalBrandLogo
        logoUrl={currentHospital?.logo_url}
        name={currentHospital?.name}
        size="md"
      />
      <Box className="min-w-0 flex-1" title={currentHospital?.name || "HealthCare"}>
        <Heading
          level={1}
          className="text-base font-bold text-gray-900 truncate"
        >
          {currentHospital?.name || "HealthCare"}
        </Heading>
        <Text variant="caption" className="truncate text-gray-500 block">
          {locationSubtitle}
        </Text>
      </Box>
    </Flex>
  );
};
