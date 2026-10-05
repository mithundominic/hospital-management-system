// Responsibility: Render individual lab order in card grid view
import { memo } from "react";
import { format } from "date-fns";
import { TestTube, Printer } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { labOrderStatusConfig, labOrderPriorityConfig } from "@/configs";
import type { LabOrderStatus } from "@/constants";
import type { LabOrder } from "@/types";

export interface LabOrderCardProps {
  order: LabOrder;
  onPrint?: (order: LabOrder) => void;
}

export const LabOrderCard = memo(({ order: o, onPrint }: LabOrderCardProps) => {
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
    <DataCard
      title={o.test_name}
      subtitle={o.test_code ? `Code: ${o.test_code}` : undefined}
      icon={<TestTube className="h-6 w-6" />}
      badge={<Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>}
      fields={[
        {
          label: "Ordered Date",
          value: dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A",
        },
        {
          label: "Priority",
          value: <Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>,
        },
      ]}
      actions={
        onPrint ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint(o)}
            icon={<Printer className="h-3.5 w-3.5" />}
          >
            Report
          </Button>
        ) : undefined
      }
    />
  );
});

LabOrderCard.displayName = "LabOrderCard";

export default LabOrderCard;
