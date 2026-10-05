// Responsibility: Manage BAA document upload form

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";
import toast from "react-hot-toast";

interface FormData {
  document_url: string;
  signed_at: string;
  expires_at: string;
}

export const useBAAForm = (hospitalId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    document_url: "",
    signed_at: "",
    expires_at: "",
  });

  const mutation = useMutation({
    mutationFn: () => tenantService.uploadBAADocument(hospitalId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baa-documents", hospitalId] });
      toast.success("BAA document uploaded successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to upload BAA document");
    },
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.document_url.trim()) {
      toast.error("Document URL is required");
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
