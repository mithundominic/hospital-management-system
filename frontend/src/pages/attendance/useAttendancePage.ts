// Responsibility: Attendance page state management and business logic

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { PERMISSIONS } from "@/constants";
import {
  getMyAttendanceRecords,
  getAttendanceRecords,
  checkIn,
  checkOut,
} from "@/services/attendance.service";

export const useAttendancePage = () => {
  const { currentHospital } = useHospital();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();
  const canViewAll = hasPermission(PERMISSIONS.ATTENDANCE_READ);

  const { data: myRecords = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ["my-attendance", currentHospital?.id],
    queryFn: () => getMyAttendanceRecords(currentHospital!.id),
    enabled: !!currentHospital,
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: false, // Only when tab is active
  });

  const { data: allRecords = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-attendance", currentHospital?.id],
    queryFn: () => getAttendanceRecords(currentHospital!.id),
    enabled: !!currentHospital && canViewAll,
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: false, // Only when tab is active
  });

  const todayRecord = myRecords.find((r) => {
    const recordDate = new Date(r.check_in_time).toDateString();
    return recordDate === new Date().toDateString();
  });

  const isCheckedIn = todayRecord && !todayRecord.check_out_time;

  const checkInMutation = useMutation({
    mutationFn: () => checkIn(currentHospital!.id, {}),
    onSuccess: () => {
      toast.success("Checked in successfully");
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
    },
    onError: () => toast.error("Failed to check in"),
  });

  const checkOutMutation = useMutation({
    mutationFn: () =>
      checkOut(currentHospital!.id, { attendance_id: todayRecord!.id }),
    onSuccess: () => {
      toast.success("Checked out successfully");
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
    },
    onError: () => toast.error("Failed to check out"),
  });

  return {
    myRecords,
    allRecords,
    isLoading: isLoadingMy || isLoadingAll,
    canViewAll,
    todayRecord,
    isCheckedIn,
    handleCheckIn: () => checkInMutation.mutate(),
    handleCheckOut: () => checkOutMutation.mutate(),
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
  } as const;
};
