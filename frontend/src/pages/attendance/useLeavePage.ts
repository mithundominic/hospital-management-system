// Responsibility: Leave page state management and approval logic

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { PERMISSIONS } from "@/constants";
import {
  getLeaveApplications,
  approveLeaveApplication,
  rejectLeaveApplication,
} from "@/services/leave.service";

export const useLeavePage = () => {
  const { currentHospital } = useHospital();
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canApprove = hasPermission(PERMISSIONS.LEAVE_WRITE);

  const { data: leaveApplications = [], isLoading } = useQuery({
    queryKey: ["leave-applications", currentHospital?.id],
    queryFn: () => getLeaveApplications(currentHospital!.id),
    enabled: !!currentHospital,
  });

  const approveMutation = useMutation({
    mutationFn: (leaveId: string) =>
      approveLeaveApplication(currentHospital!.id, leaveId),
    onSuccess: () => {
      toast.success("Leave application approved");
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
    onError: () => toast.error("Failed to approve leave"),
  });

  const rejectMutation = useMutation({
    mutationFn: (leaveId: string) =>
      rejectLeaveApplication(
        currentHospital!.id,
        leaveId,
        "Rejected by admin",
      ),
    onSuccess: () => {
      toast.success("Leave application rejected");
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
    onError: () => toast.error("Failed to reject leave"),
  });

  return {
    leaveApplications,
    isLoading,
    canApprove,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    handleApprove: (leaveId: string) => approveMutation.mutate(leaveId),
    handleReject: (leaveId: string) => rejectMutation.mutate(leaveId),
  } as const;
};
