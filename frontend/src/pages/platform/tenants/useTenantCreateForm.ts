// Responsibility: Manage tenant creation form state and submission

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";
import toast from "react-hot-toast";

export interface TenantCreateData {
  name: string;
  address: string;
  contact: string;
  license_info: string;
  timezone: string;
  locale: string;
  currency: string;
}

export const useTenantCreateForm = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TenantCreateData>({
    name: "",
    address: "",
    contact: "",
    license_info: "",
    timezone: "Asia/Kolkata",
    locale: "en",
    currency: "INR",
  });

  const mutation = useMutation({
    mutationFn: () => tenantService.createTenant(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Tenant created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create tenant");
    },
  });

  const updateField = (field: keyof TenantCreateData, value: string) => {
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
