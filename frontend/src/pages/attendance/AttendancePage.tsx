// Responsibility: Main attendance tracking page with check-in/out and records display
 
"use client";

import { Calendar, Clock } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AttendanceTable } from "./AttendanceTable";
import { useAttendancePage } from "./useAttendancePage";

export const AttendancePage = () => {
  const {
    myRecords,
    allRecords,
    isLoading,
    canViewAll,
    todayRecord,
    isCheckedIn,
    handleCheckIn,
    handleCheckOut,
    isCheckingIn,
    isCheckingOut,
  } = useAttendancePage();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Heading level={1} className="text-3xl font-bold">Attendance</Heading>
        <Flex align="center" className="gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <Text as="span" size="sm">{new Date().toLocaleDateString()}</Text>
        </Flex>
      </Flex>

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
              <Button onClick={handleCheckIn} disabled={isCheckingIn}>
                {isCheckingIn ? "Checking In..." : "Check In"}
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                disabled={isCheckingOut}
                variant="outline"
              >
                {isCheckingOut ? "Checking Out..." : "Check Out"}
              </Button>
            )}
          </Flex>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Heading level={3} className="text-lg font-semibold">
            {canViewAll ? "All Staff Attendance" : "My Attendance History"}
          </Heading>
        </CardHeader>
        <CardContent>
          <AttendanceTable records={canViewAll ? allRecords : myRecords} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendancePage;
