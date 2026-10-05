// Responsibility: Single biometric device table row with actions

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Flex } from "@/components/ui/Flex";
import { TableRow, TableCell } from "@/components/ui/Table";
import type { BiometricDevice } from "@/types/biometric";
import {
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_COLORS,
} from "@/types/biometric";

interface DeviceTableRowProps {
  device: BiometricDevice;
  onEdit: (device: BiometricDevice) => void;
  onDelete: (deviceId: string) => void;
  onToggleStatus: (deviceId: string, status: BiometricDevice["status"]) => void;
}

export const DeviceTableRow = ({
  device,
  onEdit,
  onDelete,
  onToggleStatus,
}: DeviceTableRowProps) => (
  <TableRow>
    <TableCell className="font-medium">{device.name}</TableCell>
    <TableCell className="font-mono text-sm">{device.serial_number}</TableCell>
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
      <Flex gap={2}>
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
        <Button size="sm" variant="danger" onClick={() => onDelete(device.id)}>
          Delete
        </Button>
      </Flex>
    </TableCell>
  </TableRow>
);
