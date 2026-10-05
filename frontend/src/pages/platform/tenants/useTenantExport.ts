// Responsibility: Trigger tenant data export

import { useMutation } from "@tanstack/react-query";
import { tenantService } from "@/services/tenant.service";
import toast from "react-hot-toast";

export const useTenantExport = () => {
  const mutation = useMutation({
    mutationFn: ({
      hospitalId,
      format,
    }: {
      hospitalId: string;
      format: "json" | "csv";
    }) => tenantService.exportTenantData(hospitalId, format),
    onSuccess: (data, variables) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type:
          variables.format === "csv" ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tenant-${variables.hospitalId}-export.${variables.format}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Export completed successfully");
    },
    onError: () => {
      toast.error("Failed to export tenant data");
    },
  });

  return {
    exportTenant: mutation.mutateAsync,
    isExporting: mutation.isPending,
  } as const;
};
