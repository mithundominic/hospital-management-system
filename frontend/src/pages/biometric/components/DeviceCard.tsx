// Responsibility: Render individual biometric device in card grid view
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Cpu } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_COLORS,
} from "@/types/biometric";
import type { BiometricDevice } from "@/types/biometric";

export interface DeviceCardProps {
  device: BiometricDevice;
  onEdit: (device: BiometricDevice) => void;
  onDelete: (deviceId: string) => void;
  onToggleStatus: (deviceId: string, status: BiometricDevice["status"]) => void;
}

export const DeviceCard = memo(({
  device,
  onEdit,
  onDelete,
  onToggleStatus,
}: DeviceCardProps) => {
  const syncTime = device.last_sync_at
    ? formatDistanceToNow(new Date(device.last_sync_at), { addSuffix: true })
    : "Never";

  return (
    <DataCard
      title={device.name}
      subtitle={`SN: ${device.serial_number}`}
      icon={<Cpu className="h-6 w-6" />}
      badge={
        <Badge className={DEVICE_STATUS_COLORS[device.status]}>
          {DEVICE_STATUS_LABELS[device.status]}
        </Badge>
      }
      fields={[
        { label: "Location", value: device.location || "—" },
        { label: "Last Sync", value: syncTime },
      ]}
      actions={
        <>
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
        </>
      }
    />
  );
});

DeviceCard.displayName = "DeviceCard";

export default DeviceCard;
