// Responsibility: Display attendance records in tabular format using DataTableHeader

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import {
  ATTENDANCE_STATUS_CONFIG,
  ATTENDANCE_TABLE_COLUMNS,
} from "./attendance.config";
import type { AttendanceRecord } from "./attendance.types";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export const AttendanceTable = ({ records }: AttendanceTableProps) => {
  if (records.length === 0) {
    return (
      <Box className="text-center py-8">
        <Text variant="muted">No attendance records found</Text>
      </Box>
    );
  }

  return (
    <Table>
      <DataTableHeader columns={ATTENDANCE_TABLE_COLUMNS} />
      <TableBody>
        {records.map((record) => {
          const statusConfig = ATTENDANCE_STATUS_CONFIG[record.status];
          return (
            <TableRow key={record.id}>
              <TableCell>
                {new Date(record.check_in_time).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(record.check_in_time).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {record.check_out_time
                  ? new Date(record.check_out_time).toLocaleTimeString()
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    record.source === "biometric"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {record.source === "biometric" ? "Biometric" : "Manual"}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
