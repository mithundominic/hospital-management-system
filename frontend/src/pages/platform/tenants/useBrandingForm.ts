// Responsibility: Manage branding form state and submission

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";
import toast from "react-hot-toast";
import type { TenantBranding } from "@/types/platform";

interface FormData {
  logo_url: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  custom_domain: string;
}

export const useBrandingForm = (
  hospitalId: string,
  initialBranding?: TenantBranding,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    logo_url: initialBranding?.logo_url || "",
    color_scheme: initialBranding?.color_scheme || {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#f59e0b",
    },
    custom_domain: initialBranding?.custom_domain || "",
  });

  const mutation = useMutation({
    mutationFn: () => tenantService.updateBranding(hospitalId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", hospitalId] });
      toast.success("Branding updated successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update branding");
    },
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateColorScheme = (color: keyof FormData["color_scheme"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      color_scheme: { ...prev.color_scheme, [color]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync();
  };

  return {
    formData,
    updateField,
    updateColorScheme,
    handleSubmit,
    loading: mutation.isPending,
  };
};
