// Responsibility: Display biometric devices in a table

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/Table";
import type { BiometricDevice } from "../../../types/biometric";
import {
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_COLORS,
} from "../../../types/biometric";
import { formatDistanceToNow } from "date-fns";

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
          <TableRow key={device.id}>
            <TableCell className="font-medium">{device.name}</TableCell>
            <TableCell className="font-mono text-sm">
              {device.serial_number}
            </TableCell>
            <TableCell>{device.location || "-"}</TableCell>
            <TableCell>
              <Badge className={DEVICE_STATUS_COLORS[device.status]}>
                {DEVICE_STATUS_LABELS[device.status]}
              </Badge>
            </TableCell>
            <TableCell>
              {device.last_sync_at
                ? formatDistanceToNow(new Date(device.last_sync_at), {
                    addSuffix: true,
                  })
                : "Never"}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(device)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onToggleStatus(
                      device.id,
                      device.status === "active" ? "inactive" : "active",
                    )
                  }
                >
                  {device.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(device.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
