// Responsibility: Render single hospital row with actions
 
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Power, PowerOff } from "lucide-react";
import { staffStatusConfig } from "@/configs/status";
import type { PlatformHospital } from "@/types/platform";

interface HospitalTableRowProps {
  hospital: PlatformHospital;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  isActivating: boolean;
  isDeactivating: boolean;
}

export const HospitalTableRow = ({
  hospital,
  onActivate,
  onDeactivate,
  isActivating,
  isDeactivating,
}: HospitalTableRowProps) => {
  const staffCount =
    hospital.memberships?.filter((m) => m.status === "active").length || 0;
  const onboardedDate = new Date(hospital.created_at).toLocaleDateString();
  const statusConfig = staffStatusConfig[hospital.is_active ? "active" : "inactive"];

  return (
    <TableRow className="border-b hover:bg-gray-50">
      <TableCell className="px-4 py-3 font-medium">{hospital.name}</TableCell>
      <TableCell className="px-4 py-3">{hospital.city || "—"}</TableCell>
      <TableCell className="px-4 py-3">{hospital.registration_number || "—"}</TableCell>
      <TableCell className="px-4 py-3 text-center">{staffCount}</TableCell>
      <TableCell className="px-4 py-3">
        <Badge variant={statusConfig.variant}>
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3">{onboardedDate}</TableCell>
      <TableCell className="px-4 py-3">
        {hospital.is_active ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDeactivate(hospital.id)}
            disabled={isDeactivating}
            icon={<PowerOff className="h-4 w-4" />}
          >
            Suspend
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onActivate(hospital.id)}
            disabled={isActivating}
            icon={<Power className="h-4 w-4" />}
          >
            Activate
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
