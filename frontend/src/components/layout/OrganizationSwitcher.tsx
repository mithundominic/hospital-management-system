// Responsibility: Dropdown component for switching active enterprise organization

import { useState } from "react";
import { ChevronDown, Building2 } from "lucide-react";
import { useOrganization } from "@/contexts/useOrganization";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";

export const OrganizationSwitcher = () => {
  const { organizations, currentOrganization, setCurrentOrganization } =
    useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  if (organizations.length <= 1) return null;

  return (
    <Box className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border border-blue-200 bg-blue-50/50 hover:bg-blue-100"
      >
        <Building2 className="h-4 w-4 text-blue-600" />
        <Text
          size="sm"
          className="font-semibold text-blue-900 max-w-[130px] truncate"
        >
          {currentOrganization?.name || "Organization"}
        </Text>
        <Badge variant="info" className="text-[10px] px-1 py-0 uppercase">
          {currentOrganization?.role || "Org"}
        </Badge>
        <ChevronDown className="h-3 w-3 text-blue-500" />
      </Button>

      {isOpen && (
        <Box className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          <Box className="px-3 py-1.5 border-b border-gray-100">
            <Text
              variant="caption"
              className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]"
            >
              Enterprise Organizations
            </Text>
          </Box>
          <Box className="max-h-60 overflow-y-auto py-1">
            {organizations.map((org) => {
              const isSelected = org.id === currentOrganization?.id;
              return (
                <Button
                  key={org.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentOrganization(org);
                    setIsOpen(false);
                  }}
                  className={`w-full justify-between px-3 py-2 text-left rounded-none ${
                    isSelected ? "bg-blue-50 font-semibold" : ""
                  }`}
                >
                  <Text size="sm" className="truncate text-gray-800">
                    {org.name}
                  </Text>
                  <Badge variant="default" className="text-[10px] px-1 py-0">
                    {org.role}
                  </Badge>
                </Button>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrganizationSwitcher;
