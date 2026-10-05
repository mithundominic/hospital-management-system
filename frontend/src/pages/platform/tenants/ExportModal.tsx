// Responsibility: Render export format selection modal

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { useTenantExport } from "./useTenantExport";
import type { Tenant } from "@/types/platform";

interface Props {
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
}

const EXPORT_FORMAT_OPTIONS = [
  { value: "json", label: "JSON" },
  { value: "csv", label: "CSV" },
] as const;

export const ExportModal = ({ tenant, isOpen, onClose }: Props) => {
  const [format, setFormat] = useState<"json" | "csv">("json");
  const { exportTenant, isExporting } = useTenantExport();

  const handleExport = async () => {
    await exportTenant({ hospitalId: tenant.id, format });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Tenant Data">
      <Box className="space-y-4">
        <Box>
          <Label>Export Format</Label>
          <RadioGroup
            name="export-format"
            options={EXPORT_FORMAT_OPTIONS}
            value={format}
            onChange={(val) => setFormat(val as "json" | "csv")}
            className="mt-2"
          />
        </Box>

        <Text className="text-sm text-gray-600">
          Export includes: hospital settings, branding, BAA documents,
          departments, and lifecycle events. Patient and clinical data are not
          included.
        </Text>

        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </Box>
    </Modal>
  );
};
