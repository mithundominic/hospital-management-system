// Responsibility: Render single selectable hospital item with logo and active checkmark

import { Check } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { HospitalBrandLogo } from "./HospitalBrandLogo";
import type { Hospital } from "@/types/hospital";

interface HospitalSwitcherItemProps {
  hospital: Hospital;
  isSelected: boolean;
  onSelect: (h: Hospital) => void;
}

export const HospitalSwitcherItem = ({
  hospital,
  isSelected,
  onSelect,
}: HospitalSwitcherItemProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSelect(hospital)}
      className="w-full justify-between text-left px-3 py-2 hover:bg-gray-50 h-auto"
    >
      <Flex align="center" gap={2} className="min-w-0 flex-1">
        <HospitalBrandLogo logoUrl={hospital.logo_url} name={hospital.name} size="sm" />
        <Box className="min-w-0 flex-1">
          <Text size="sm" className="font-medium text-gray-900 truncate block">
            {hospital.name}
          </Text>
          {hospital.city && (
            <Text variant="caption" className="text-gray-400 block truncate">
              {hospital.city}
            </Text>
          )}
        </Box>
      </Flex>
      {isSelected && <Check className="h-4 w-4 text-primary-600 shrink-0 ml-2" />}
    </Button>
  );
};
