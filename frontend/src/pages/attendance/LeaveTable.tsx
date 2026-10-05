// Responsibility: Display leave applications in table or cards view using reusable DataTable
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/common/DataTable";
import { LeaveCard } from "./LeaveCard";
import {
  LEAVE_STATUS_CONFIG,
  LEAVE_TABLE_COLUMNS,
} from "./attendance.config";
import type { LeaveApplication } from "./attendance.types";

interface LeaveTableProps {
  applications: LeaveApplication[];
  canApprove: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveTable = ({
  applications,
  canApprove,
  onApprove,
  onReject,
}: LeaveTableProps) => {
  const columns = canApprove
    ? [...LEAVE_TABLE_COLUMNS, { key: "actions", header: "Actions" }]
    : LEAVE_TABLE_COLUMNS;

  return (
    <DataTable
      columns={columns}
      data={applications}
      showViewToggle={true}
      emptyIcon={Calendar}
      emptyTitle="No leave applications found"
      emptyDescription="Submitted employee leave requests will appear here."
      renderRow={(app) => {
        const statusConfig = LEAVE_STATUS_CONFIG[app.status];
        const isPending = app.status === "pending";

        return (
          <TableRow key={app.id}>
            <TableCell>{app.user?.email || "Unknown"}</TableCell>
            <TableCell className="capitalize">{app.leave_type}</TableCell>
            <TableCell>{new Date(app.start_date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(app.end_date).toLocaleDateString()}</TableCell>
            <TableCell>{app.days_count}</TableCell>
            <TableCell>
              <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
            </TableCell>
            {canApprove && (
              <TableCell>
                {isPending && (
                  <Flex className="gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onApprove(app.id)}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onReject(app.id)}
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  </Flex>
                )}
              </TableCell>
            )}
          </TableRow>
        );
      }}
      renderCard={(app) => (
        <LeaveCard
          key={app.id}
          application={app}
          canApprove={canApprove}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    />
  );
};

export default LeaveTable;
