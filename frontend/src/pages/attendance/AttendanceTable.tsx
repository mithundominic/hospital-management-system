// Responsibility: Display attendance records in table or cards view using reusable DataTable
import { Calendar } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { AttendanceCard } from "./AttendanceCard";
import {
  ATTENDANCE_STATUS_CONFIG,
  ATTENDANCE_TABLE_COLUMNS,
} from "./attendance.config";
import type { AttendanceRecord } from "./attendance.types";

export interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export const AttendanceTable = ({ records }: AttendanceTableProps) => (
  <DataTable
    columns={ATTENDANCE_TABLE_COLUMNS}
    data={records}
    showViewToggle={true}
    emptyIcon={Calendar}
    emptyTitle="No attendance records found"
    emptyDescription="Attendance check-ins and biometric events will appear here."
    renderRow={(record) => {
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
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
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
    }}
    renderCard={(record) => <AttendanceCard key={record.id} record={record} />}
  />
);

export default AttendanceTable;
