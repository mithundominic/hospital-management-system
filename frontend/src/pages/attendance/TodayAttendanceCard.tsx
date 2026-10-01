// Responsibility: Render today's check-in/out status card with action buttons

import { Clock } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import type { AttendanceRecord } from "./attendance.types";

export interface TodayAttendanceCardProps {
  todayRecord?: AttendanceRecord | null;
  isCheckedIn?: boolean;
  isCheckingIn?: boolean;
  isCheckingOut?: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

export const TodayAttendanceCard = ({
  todayRecord,
  isCheckedIn = false,
  isCheckingIn = false,
  isCheckingOut = false,
  onCheckIn,
  onCheckOut,
}: TodayAttendanceCardProps) => (
  <Card>
    <CardHeader>
      <Heading level={3} className="text-lg font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Today's Attendance
      </Heading>
    </CardHeader>
    <CardContent className="space-y-4">
      {todayRecord && (
        <Box className="text-sm space-y-2">
          <Text>
            <Text as="span" weight="medium">Checked In: </Text>
            <Text as="span">{new Date(todayRecord.check_in_time).toLocaleTimeString()}</Text>
          </Text>
          {todayRecord.check_out_time && (
            <Text>
              <Text as="span" weight="medium">Checked Out: </Text>
              <Text as="span">{new Date(todayRecord.check_out_time).toLocaleTimeString()}</Text>
            </Text>
          )}
        </Box>
      )}

      <Flex className="gap-4">
        {!isCheckedIn ? (
          <Button onClick={onCheckIn} disabled={isCheckingIn}>
            {isCheckingIn ? "Checking In..." : "Check In"}
          </Button>
        ) : (
          <Button
            onClick={onCheckOut}
            disabled={isCheckingOut}
            variant="outline"
          >
            {isCheckingOut ? "Checking Out..." : "Check Out"}
          </Button>
        )}
      </Flex>
    </CardContent>
  </Card>
);

export default TodayAttendanceCard;
