// Responsibility: Dropdown component for switching active hospital tenant or onboarding new tenant

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus } from "lucide-react";
import { useHospital } from "@/contexts/useHospital";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { HospitalBrandLogo } from "./HospitalBrandLogo";
import { HospitalSwitcherItem } from "./HospitalSwitcherItem";

export const HospitalSwitcher = () => {
  const { hospitals, currentHospital, setCurrentHospital } = useHospital();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (hospitals.length === 0) return null;

  return (
    <Box className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 hover:bg-gray-100"
      >
        <HospitalBrandLogo
          logoUrl={currentHospital?.logo_url}
          name={currentHospital?.name}
          size="sm"
        />
        <Text size="sm" className="font-medium max-w-[140px] truncate">
          {currentHospital?.name || "Select Hospital"}
        </Text>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      {isOpen && (
        <Box className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          <Box className="px-3 py-1.5 border-b border-gray-100">
            <Text variant="caption" className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
              Active Hospital
            </Text>
          </Box>
          <Box className="max-h-60 overflow-y-auto py-1">
            {hospitals.map((h) => (
              <HospitalSwitcherItem
                key={h.id}
                hospital={h}
                isSelected={h.id === currentHospital?.id}
                onSelect={(selected) => {
                  setCurrentHospital(selected);
                  setIsOpen(false);
                }}
              />
            ))}
          </Box>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              navigate("/onboarding");
            }}
            className="w-full justify-start text-left px-3 py-2 text-primary-600 border-t border-gray-100 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Onboard New Hospital
          </Button>
        </Box>
      )}
    </Box>
  );
};
