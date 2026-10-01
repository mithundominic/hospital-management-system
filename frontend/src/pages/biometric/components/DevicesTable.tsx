// Responsibility: Display biometric devices in a table

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/Table";
import type { BiometricDevice } from "@/types/biometric";
import { DeviceTableRow } from "./DeviceTableRow";

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
}: DevicesTableProps) => {
  if (devices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No devices registered. Add your first biometric device to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Device Name</TableHead>
          <TableHead>Serial Number</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Sync</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.map((device) => (
          <DeviceTableRow
            key={device.id}
            device={device}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </TableBody>
    </Table>
  );
};
