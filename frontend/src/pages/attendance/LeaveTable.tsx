// Responsibility: Display leave applications in tabular format with approval actions
 
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";
import { DataTableHeader } from "@/components/common/DataTableHeader";
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
  if (applications.length === 0) {
    return (
      <Box className="text-center py-8">
        <Text variant="muted">No leave applications found</Text>
      </Box>
    );
  }

  const columns = canApprove
    ? [...LEAVE_TABLE_COLUMNS, { key: "actions", header: "Actions" }]
    : LEAVE_TABLE_COLUMNS;

  return (
    <Table>
      <DataTableHeader columns={columns} />
      <TableBody>
        {applications.map((app) => {
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
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
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
        })}
      </TableBody>
    </Table>
  );
};
