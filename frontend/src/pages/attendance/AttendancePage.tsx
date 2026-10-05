// Responsibility: Main attendance tracking page with tabs for my records and staff records

"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Tabs } from "@/components/ui/Tabs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AttendanceTable } from "./AttendanceTable";
import { TodayAttendanceCard } from "./TodayAttendanceCard";
import {
  buildAttendanceTabs,
  type AttendanceTabId,
} from "./attendance.config";
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
  const [activeTab, setActiveTab] = useState<AttendanceTabId>("my");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const tabs = buildAttendanceTabs(myRecords.length, allRecords.length);

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Heading level={1} className="text-3xl font-bold">Attendance</Heading>
        <Flex align="center" className="gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <Text as="span" size="sm">{new Date().toLocaleDateString()}</Text>
        </Flex>
      </Flex>

      <TodayAttendanceCard
        todayRecord={todayRecord}
        isCheckedIn={isCheckedIn}
        isCheckingIn={isCheckingIn}
        isCheckingOut={isCheckingOut}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />

      {canViewAll ? (
        <Box className="space-y-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <AttendanceTable
            records={activeTab === "my" ? myRecords : allRecords}
          />
        </Box>
      ) : (
        <AttendanceTable records={myRecords} />
      )}
    </Box>
  );
};

export default AttendancePage;
