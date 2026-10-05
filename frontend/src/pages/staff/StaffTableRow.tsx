// Responsibility: Render individual staff member table row with avatar, role badge, and contact details
import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { staffRoleBadgeConfig, staffStatusConfig } from "@/configs/status.config";
import type { MembershipDto } from "@/services/staff.service";

export interface StaffTableRowProps {
  member: MembershipDto;
}

export const StaffTableRow = memo(({ member }: StaffTableRowProps) => {
  const roleConfig = staffRoleBadgeConfig[member.role_name] || {
    label: member.role_name,
    variant: "default" as const,
  };
  const statusConfig = staffStatusConfig[member.status] || {
    label: member.status,
    variant: "default" as const,
  };
  const initial = member.user_name?.charAt(0) || member.user_email?.charAt(0) || "S";

  return (
    <TableRow>
      <TableCell>
        <Flex align="center" gap={3}>
          <Flex
            align="center"
            justify="center"
            className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-xs shrink-0"
          >
            {initial.toUpperCase()}
          </Flex>
          <Box className="min-w-0">
            <Text weight="medium" className="truncate">
              {member.user_name || member.user_email || "Staff Member"}
            </Text>
          </Box>
        </Flex>
      </TableCell>
      <TableCell>
        <Badge variant={roleConfig.variant} size="sm">
          {roleConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Text size="sm" variant="muted">
          {member.user_email || "—"}
        </Text>
      </TableCell>
      <TableCell>
        <Text size="sm">
          {member.user_phone || "—"}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={statusConfig.variant} size="sm">
          {statusConfig.label}
        </Badge>
      </TableCell>
    </TableRow>
  );
});

StaffTableRow.displayName = "StaffTableRow";

export default StaffTableRow;
