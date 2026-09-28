// Responsibility: Render single lab order row with priority and status chips

import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { labOrderStatusConfig } from "@/configs";
import type { LabOrderStatus } from "@/constants";
import type { LabOrder } from "@/types";

export interface LabOrdersTableRowProps {
  order: LabOrder;
}

const priorityBadgeMap: Record<string, BadgeVariant> = {
  stat: "danger",
  urgent: "warning",
  routine: "default",
};

export const LabOrdersTableRow = ({ order: o }: LabOrdersTableRowProps) => {
  const badgeConfig = labOrderStatusConfig[o.status as LabOrderStatus] || {
    label: o.status.replace("_", " "),
    variant: "default" as const,
  };

  return (
  <TableRow>
    <TableCell>
      <Text weight="medium">{o.test_name}</Text>
      {o.test_code && (
        <Text size="xs" variant="muted">Code: {o.test_code}</Text>
      )}
    </TableCell>
    <TableCell>
      <Text size="sm">
        {o.ordered_date ? format(new Date(o.ordered_date), "dd MMM yyyy") : "N/A"}
      </Text>
    </TableCell>
    <TableCell>
      <Badge variant={priorityBadgeMap[o.priority] || "default"}>
        {o.priority.toUpperCase()}
      </Badge>
    </TableCell>
      <TableCell>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
      </TableCell>
    </TableRow>
  );
};

export default LabOrdersTableRow;
