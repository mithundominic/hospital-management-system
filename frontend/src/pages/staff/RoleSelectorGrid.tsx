// Responsibility: Render selectable hospital staff role options with permissions badge

import { Shield } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { hospitalRoles } from "./staff.data";

export interface RoleSelectorGridProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

const roleSelectorStyles: Record<
  "selected" | "unselected",
  {
    container: string;
    icon: string;
    badgeVariant: BadgeVariant;
  }
> = {
  selected: {
    container: "border-primary-600 bg-primary-50 ring-1 ring-primary-500",
    icon: "text-primary-600",
    badgeVariant: "info",
  },
  unselected: {
    container: "border-gray-200 hover:bg-gray-50",
    icon: "text-gray-400",
    badgeVariant: "default",
  },
};

export const RoleSelectorGrid = ({
  selectedRole,
  onSelectRole,
}: RoleSelectorGridProps) => {
  return (
    <Box className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {hospitalRoles.map((role) => {
        const isSelected = selectedRole === role.name;
        const styles =
          roleSelectorStyles[isSelected ? "selected" : "unselected"];
        return (
          <Box
            key={role.name}
            onClick={() => onSelectRole(role.name)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${styles.container}`}
          >
            <Flex justify="between" align="center">
              <Flex align="center" gap={2}>
                <Shield className={`h-4 w-4 ${styles.icon}`} />
                <Text weight="medium" size="sm">
                  {role.label}
                </Text>
              </Flex>
              <Badge variant={styles.badgeVariant} size="sm">
                {role.permissions} permissions
              </Badge>
            </Flex>
            <Text size="xs" variant="muted" className="mt-1">
              {role.description}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
