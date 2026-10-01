// Responsibility: Configuration objects for attendance and leave status badges, tabs, and table columns

import type { TableColumn } from "@/types/table.types";
import type { TabItem } from "@/components/ui/Tabs";
import type { AttendanceRecord, LeaveApplication } from "./attendance.types";

export type AttendanceTabId = "my" | "all";

export const ATTENDANCE_STATUS_CONFIG = {
  checked_in: {
    label: "Checked In",
    color: "bg-green-100 text-green-800",
  },
  checked_out: {
    label: "Checked Out",
    color: "bg-gray-100 text-gray-800",
  },
  absent: {
    label: "Absent",
    color: "bg-red-100 text-red-800",
  },
} as const;

export const LEAVE_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
  },
} as const;

export const LEAVE_TYPE_OPTIONS = [
  { value: "casual", label: "Casual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "earned", label: "Earned Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
] as const;

export const ATTENDANCE_TABLE_COLUMNS: readonly TableColumn<AttendanceRecord>[] =
  [
    { key: "date", header: "Date" },
    { key: "check_in", header: "Check In" },
    { key: "check_out", header: "Check Out" },
    { key: "status", header: "Status" },
    { key: "source", header: "Source" },
  ] as const;

export const LEAVE_TABLE_COLUMNS: readonly TableColumn<LeaveApplication>[] = [
  { key: "user", header: "Employee" },
  { key: "leave_type", header: "Leave Type" },
  { key: "start_date", header: "Start Date" },
  { key: "end_date", header: "End Date" },
  { key: "days_count", header: "Days" },
  { key: "status", header: "Status" },
] as const;

export const buildAttendanceTabs = (
  myCount: number,
  allCount: number,
): readonly TabItem<AttendanceTabId>[] => [
  { id: "my", label: "My Attendance History", count: myCount },
  { id: "all", label: "All Staff Attendance", count: allCount },
] as const;
