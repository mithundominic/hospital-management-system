// Responsibility: Render individual staff member profile card with contact and role badge

import { Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

export interface Membership {
  id: string;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
  role_name: string;
  status: string;
}

export interface StaffMemberCardProps {
  member: Membership;
}

const roleBadgeVariants: Record<string, BadgeVariant> = {
  HospitalAdmin: "purple",
  Doctor: "info",
  Nurse: "success",
  Receptionist: "warning",
  BillingClerk: "warning",
  LabTech: "info",
  Pharmacist: "purple",
};

const memberStatusBadgeMap: Record<string, BadgeVariant> = {
  active: "success",
  inactive: "default",
};

export const StaffMemberCard = ({ member }: StaffMemberCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <Flex align="center" gap={3}>
        <Flex
          align="center"
          justify="center"
          className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 font-semibold shrink-0"
        >
          {member.user_email?.charAt(0).toUpperCase() || "S"}
        </Flex>
        <Box className="flex-1 min-w-0">
          <Text weight="medium" className="truncate">
            {member.user_name || member.user_email || "Staff"}
          </Text>
          <Badge
            variant={roleBadgeVariants[member.role_name] || "default"}
            size="sm"
            className="mt-1"
          >
            {member.role_name}
          </Badge>
        </Box>
      </Flex>
      <Box className="mt-3 space-y-1 text-sm text-gray-600">
        <Flex align="center" gap={2}>
          <Mail className="h-4 w-4 text-gray-400 shrink-0" />
          <Text size="xs" variant="muted" className="truncate">
            {member.user_email || "No email"}
          </Text>
        </Flex>
        {member.user_phone && (
          <Flex align="center" gap={2}>
            <Phone className="h-4 w-4 text-gray-400 shrink-0" />
            <Text size="xs" variant="muted">
              {member.user_phone}
            </Text>
          </Flex>
        )}
      </Box>
      <Flex
        justify="between"
        align="center"
        className="mt-3 pt-3 border-t border-gray-200"
      >
        <Badge
          variant={memberStatusBadgeMap[member.status] || "default"}
          size="sm"
        >
          {member.status}
        </Badge>
      </Flex>
    </Card>
  );
};
