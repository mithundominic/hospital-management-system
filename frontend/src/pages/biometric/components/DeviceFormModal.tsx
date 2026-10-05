// Responsibility: Modal form for creating/editing biometric devices

import { FormModal } from "@/components/common/FormModal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useDeviceForm } from "../hooks/useDeviceForm";
import type { BiometricDevice, CreateDeviceInput } from "@/types/biometric";

interface DeviceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeviceInput) => Promise<void>;
  device?: BiometricDevice;
}

export const DeviceFormModal = ({
  open,
  onClose,
  onSubmit,
  device,
}: DeviceFormModalProps) => {
  const { formData, setField, reset, handleSubmit } = useDeviceForm(
    device,
    onSubmit,
    onClose,
  );

  return (
    <FormModal
      isOpen={open}
      onClose={() => {
        reset();
        onClose();
      }}
      onSubmit={handleSubmit}
      title={device ? "Edit Device" : "Add Device"}
      submitLabel={device ? "Update" : "Add"}
    >
      <FormField label="Serial Number" required>
        <Input
          value={formData.serial_number}
          onChange={(e) => setField("serial_number", e.target.value)}
          required
          disabled={!!device}
          placeholder="DEVICE001"
        />
      </FormField>

      <FormField label="Device Name" required>
        <Input
          value={formData.name}
          onChange={(e) => setField("name", e.target.value)}
          required
          placeholder="Main Entrance Device"
        />
      </FormField>

      <FormField label="Location">
        <Input
          value={formData.location}
          onChange={(e) => setField("location", e.target.value)}
          placeholder="Floor 1, Main Entrance"
        />
      </FormField>

      <FormField label="Model">
        <Input
          value={formData.model}
          onChange={(e) => setField("model", e.target.value)}
          placeholder="ZKTeco K40"
        />
      </FormField>

      <FormField label="IP Address">
        <Input
          value={formData.ip_address}
          onChange={(e) => setField("ip_address", e.target.value)}
          placeholder="192.168.1.100"
        />
      </FormField>
    </FormModal>
  );
};
