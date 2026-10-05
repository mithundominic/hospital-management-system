// Responsibility: Display biometric devices in table or cards view using reusable DataTable
import { Cpu } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import type { BiometricDevice } from "@/types/biometric";
import { DeviceTableRow } from "./DeviceTableRow";
import { DeviceCard } from "./DeviceCard";

const DEVICE_COLUMNS = [
  { key: "name", header: "Device Name" },
  { key: "serial", header: "Serial Number" },
  { key: "location", header: "Location" },
  { key: "status", header: "Status" },
  { key: "last_sync", header: "Last Sync" },
  { key: "actions", header: "Actions" },
] as const;

interface DevicesTableProps {
  devices: BiometricDevice[];
  onEdit: (device: BiometricDevice) => void;
  onDelete: (deviceId: string) => void;
  onToggleStatus: (deviceId: string, status: BiometricDevice["status"]) => void;
}

export const DevicesTable = ({
  devices,
  onEdit,
  onDelete,
  onToggleStatus,
}: DevicesTableProps) => (
  <DataTable
    columns={DEVICE_COLUMNS}
    data={devices}
    showViewToggle={true}
    emptyIcon={Cpu}
    emptyTitle="No devices registered"
    emptyDescription="Add your first biometric attendance device to get started."
    renderRow={(device) => (
      <DeviceTableRow
        key={device.id}
        device={device}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    )}
    renderCard={(device) => (
      <DeviceCard
        key={device.id}
        device={device}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    )}
  />
);

export default DevicesTable;
