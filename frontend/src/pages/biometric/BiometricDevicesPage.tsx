// Responsibility: Biometric device management page

import { useState } from "react";
import { useHospital } from "@/contexts/useHospital";
import { useBiometricDevices } from "./hooks/useBiometricDevices";
import { DevicesTable } from "./components/DevicesTable";
import { DeviceFormModal } from "./components/DeviceFormModal";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { PageHeader } from "@/components/common/PageHeader";
import type { BiometricDevice } from "@/types/biometric";

const BiometricDevicesPage = () => {
  const { currentHospital } = useHospital();
  const hospitalId = currentHospital?.id || "";

  const {
    devices,
    isLoading,
    createDevice,
    updateDevice,
    updateDeviceStatus,
    deleteDevice,
  } = useBiometricDevices(hospitalId);

  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<
    BiometricDevice | undefined
  >();

  const handleEdit = (device: BiometricDevice) => {
    setEditingDevice(device);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingDevice(undefined);
    setShowModal(true);
  };

  const handleDelete = async (deviceId: string) => {
    if (confirm("Are you sure you want to delete this device?")) {
      await deleteDevice(deviceId);
    }
  };

  if (isLoading) return <Box>Loading devices...</Box>;

  return (
    <Box className="p-6">
      <PageHeader
        title="Biometric Devices"
        description="Manage ZKTeco biometric attendance devices"
        action={<Button onClick={handleAdd}>Add Device</Button>}
        className="mb-6"
      />

      <DevicesTable
        devices={devices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={(deviceId, status) =>
          updateDeviceStatus({ deviceId, status })
        }
      />

      <DeviceFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          await (editingDevice
            ? updateDevice({ deviceId: editingDevice.id, data })
            : createDevice(data));
          setShowModal(false);
        }}
        device={editingDevice}
      />
    </Box>
  );
};

export default BiometricDevicesPage;
