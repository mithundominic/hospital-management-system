// Responsibility: Render individual leave application in card grid view
import { memo } from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LEAVE_STATUS_CONFIG } from "./attendance.config";
import type { LeaveApplication } from "./attendance.types";

export interface LeaveCardProps {
  application: LeaveApplication;
  canApprove: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveCard = memo(({
  application: app,
  canApprove,
  onApprove,
  onReject,
}: LeaveCardProps) => {
  const statusConfig = LEAVE_STATUS_CONFIG[app.status];
  const isPending = app.status === "pending";

  return (
    <DataCard
      title={app.user?.email || "Staff Member"}
      subtitle={`${app.leave_type.toUpperCase()} Leave • ${app.days_count} days`}
      icon={<Calendar className="h-6 w-6" />}
      badge={<Badge className={statusConfig.color}>{statusConfig.label}</Badge>}
      fields={[
        {
          label: "Start Date",
          value: new Date(app.start_date).toLocaleDateString(),
        },
        {
          label: "End Date",
          value: new Date(app.end_date).toLocaleDateString(),
        },
        ...(app.reason ? [{ label: "Reason", value: app.reason }] : []),
      ]}
      actions={
        canApprove && isPending ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onApprove(app.id)}
              icon={<CheckCircle className="h-3.5 w-3.5 text-green-600" />}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onReject(app.id)}
              icon={<XCircle className="h-3.5 w-3.5" />}
            >
              Reject
            </Button>
          </>
        ) : undefined
      }
    />
  );
});

LeaveCard.displayName = "LeaveCard";

export default LeaveCard;
