// Responsibility: Manage tenant cloning form state

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  address: string;
  contact: string;
}

export const useTenantCloneForm = (
  hospitalId: string,
  defaultName: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    name: `Copy of ${defaultName}`,
    address: "",
    contact: "",
  });

  const mutation = useMutation({
    mutationFn: () => tenantService.cloneTenant(hospitalId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant cloned successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to clone tenant");
    },
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tenant name is required");
      return;
    }
    await mutation.mutateAsync();
  };

  return {
    formData,
    updateField,
    handleSubmit,
    loading: mutation.isPending,
  };
};
