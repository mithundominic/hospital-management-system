// Responsibility: Render single lab order row with priority and status chips

import { memo } from "react";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { labOrderStatusConfig, labOrderPriorityConfig } from "@/configs";
import type { LabOrderStatus } from "@/constants";
import type { LabOrder } from "@/types";

export interface LabOrdersTableRowProps {
  order: LabOrder;
  onPrint?: (order: LabOrder) => void;
}

export const LabOrdersTableRow = memo(({ order: o, onPrint }: LabOrdersTableRowProps) => {
  const badgeConfig = labOrderStatusConfig[o.status as LabOrderStatus] || {
    label: (o.status || "ordered").replace("_", " "),
    variant: "default" as const,
  };
  const priority = o.priority || "routine";
  const priorityConfig = labOrderPriorityConfig[priority] || {
    label: priority.toUpperCase(),
    variant: "default" as const,
  };
  const dateStr = o.ordered_date || o.ordered_at || o.created_at;

  return (
    <TableRow>
      <TableCell>
        <Text weight="medium">{o.test_name}</Text>
        {o.test_code && (
          <Text size="xs" variant="muted">
            Code: {o.test_code}
          </Text>
        )}
      </TableCell>
      <TableCell>
        <Text size="sm">
          {dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A"}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={priorityConfig.variant}>
          {priorityConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
      </TableCell>
      <TableCell className="text-right">
        {onPrint && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Printer className="h-4 w-4" />}
            onClick={() => onPrint(o)}
            title="Print Pathology Report"
          />
        )}
      </TableCell>
    </TableRow>
  );
});

LabOrdersTableRow.displayName = "LabOrdersTableRow";

export default LabOrdersTableRow;
