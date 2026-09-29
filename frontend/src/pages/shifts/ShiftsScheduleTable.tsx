// Responsibility: Render weekly staff shift timetable grid with duty slots

import { useMemo } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { buildShiftScheduleColumns } from "./shift.config";
import type { Shift } from "@/types";

export interface ShiftsScheduleTableProps {
  shifts: Shift[];
  weekDays: Date[];
  isLoading: boolean;
}

export const ShiftsScheduleTable = ({
  shifts,
  weekDays,
  isLoading,
}: ShiftsScheduleTableProps) => {
  const columns = useMemo(
    () => buildShiftScheduleColumns(weekDays),
    [weekDays],
  );

  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={5} columns={8} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <DataTableHeader columns={columns} />
        <TableBody>
          {shifts.slice(0, 10).map((shift) => (
            <TableRow key={shift.id}>
              <TableCell>
                <Text weight="medium">Staff Member</Text>
                <Text size="xs" variant="muted">
                  {shift.shift_type}
                </Text>
              </TableCell>
              {weekDays.map((day) => {
                const isMatchingDate =
                  shift.shift_date === format(day, "yyyy-MM-dd");
                return (
                  <TableCell key={day.toISOString()} className="text-center">
                    {isMatchingDate ? (
                      <Badge variant="info" size="sm">
                        <Clock className="h-3 w-3 mr-1 inline" />
                        {shift.start_time} - {shift.end_time}
                      </Badge>
                    ) : (
                      <Text size="xs" variant="muted">
                        —
                      </Text>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ShiftsScheduleTable;
