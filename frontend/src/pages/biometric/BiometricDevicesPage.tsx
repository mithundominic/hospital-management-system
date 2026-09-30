// Responsibility: Biometric device management page

import { useState } from "react";
import { useHospital } from "../../contexts/useHospital";
import { useBiometricDevices } from "./hooks/useBiometricDevices";
import { DevicesTable } from "./components/DevicesTable";
import { DeviceFormModal } from "./components/DeviceFormModal";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { BiometricDevice } from "../../types/biometric";

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

  if (isLoading) return <div>Loading devices...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Biometric Devices</h1>
          <p className="text-gray-600">
            Manage ZKTeco biometric attendance devices
          </p>
        </div>
        <Button onClick={handleAdd}>Add Device</Button>
      </div>

      <Card>
        <DevicesTable
          devices={devices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={(deviceId, status) =>
            updateDeviceStatus({ deviceId, status })
          }
        />
      </Card>

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
    </div>
  );
};

export default BiometricDevicesPage;
