// Responsibility: Leave form state management and submission logic

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import { createLeaveApplication } from "@/services/leave.service";

interface LeaveFormData {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export const useLeaveForm = (onSuccess: () => void) => {
  const { currentHospital } = useHospital();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<LeaveFormData>({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const mutation = useMutation({
    mutationFn: () => {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

      return createLeaveApplication(currentHospital!.id, {
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        days_count: days,
        reason: formData.reason || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Leave application submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
      setFormData({ leave_type: "", start_date: "", end_date: "", reason: "" });
      onSuccess();
    },
    onError: () => toast.error("Failed to submit leave application"),
  });

  const handleChange = (field: keyof LeaveFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leave_type || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    mutation.mutate();
  };

  return {
    formData,
    isSubmitting: mutation.isPending,
    handleChange,
    handleSubmit,
  } as const;
};
