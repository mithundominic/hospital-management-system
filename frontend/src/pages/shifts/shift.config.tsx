// Responsibility: Shift schedule table column builders and configurations

import { format } from "date-fns";
import { Text } from "@/components/ui/Text";
import type { TableColumn } from "@/types/table.types";
import type { Shift } from "@/types";

export const buildShiftScheduleColumns = (
  weekDays: Date[],
): TableColumn<Shift>[] => [
  { key: "staff", header: "Staff Member" },
  ...weekDays.map((day) => ({
    key: day.toISOString(),
    header: (
      <>
        <Text size="xs" weight="bold">
          {format(day, "EEE")}
        </Text>
        <Text size="xs" variant="muted">
          {format(day, "MMM d")}
        </Text>
      </>
    ),
    headerClassName: "text-center",
  })),
];
