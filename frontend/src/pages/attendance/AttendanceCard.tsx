// Responsibility: Render individual attendance record in card grid view
import { memo } from "react";
import { Calendar } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { ATTENDANCE_STATUS_CONFIG } from "./attendance.config";
import type { AttendanceRecord } from "./attendance.types";

export interface AttendanceCardProps {
  record: AttendanceRecord;
}

export const AttendanceCard = memo(({ record }: AttendanceCardProps) => {
  const statusConfig = ATTENDANCE_STATUS_CONFIG[record.status];
  const dateStr = new Date(record.check_in_time).toLocaleDateString();
  const checkInStr = new Date(record.check_in_time).toLocaleTimeString();
  const checkOutStr = record.check_out_time
    ? new Date(record.check_out_time).toLocaleTimeString()
    : "-";

  return (
    <DataCard
      title={dateStr}
      subtitle={record.source === "biometric" ? "Biometric Log" : "Manual Entry"}
      icon={<Calendar className="h-6 w-6" />}
      badge={<Badge className={statusConfig.color}>{statusConfig.label}</Badge>}
      fields={[
        { label: "Check In", value: checkInStr },
        { label: "Check Out", value: checkOutStr },
        {
          label: "Source",
          value: (
            <Badge
              className={
                record.source === "biometric"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {record.source === "biometric" ? "Biometric" : "Manual"}
            </Badge>
          ),
        },
      ]}
    />
  );
});

AttendanceCard.displayName = "AttendanceCard";

export default AttendanceCard;
