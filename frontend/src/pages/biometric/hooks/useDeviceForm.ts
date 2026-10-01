// Responsibility: Form state management for biometric device creation/editing

import { useState, useEffect } from "react";
import type { BiometricDevice, CreateDeviceInput } from "@/types/biometric";

export const useDeviceForm = (
  device: BiometricDevice | undefined,
  onSubmit: (data: CreateDeviceInput) => Promise<void>,
  onClose: () => void,
) => {
  const [formData, setFormData] = useState<CreateDeviceInput>({
    serial_number: "",
    name: "",
    location: "",
    model: "",
    ip_address: "",
  });

  useEffect(() => {
    if (device) {
      setFormData({
        serial_number: device.serial_number,
        name: device.name,
        location: device.location || "",
        model: device.model || "",
        ip_address: device.ip_address || "",
      });
    }
  }, [device]);

  const setField = <K extends keyof CreateDeviceInput>(
    key: K,
    value: CreateDeviceInput[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setFormData({
      serial_number: "",
      name: "",
      location: "",
      model: "",
      ip_address: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    reset();
    onClose();
  };

  return { formData, setField, reset, handleSubmit } as const;
};
