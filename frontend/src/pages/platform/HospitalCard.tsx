// Responsibility: Render individual platform hospital in card grid view
import { memo } from "react";
import { Building2, Power, PowerOff } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staffStatusConfig } from "@/configs/status";
import type { PlatformHospital } from "@/types/platform";

export interface HospitalCardProps {
  hospital: PlatformHospital;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  isActivating: boolean;
  isDeactivating: boolean;
}

export const HospitalCard = memo(({
  hospital,
  onActivate,
  onDeactivate,
  isActivating,
  isDeactivating,
}: HospitalCardProps) => {
  const staffCount =
    hospital.staff_count ??
    (hospital.memberships?.filter((m) => m.status === "active").length || 0);
  const patientCount = hospital.patient_count ?? 0;
  const onboardedDate = new Date(hospital.created_at).toLocaleDateString();
  const statusConfig = staffStatusConfig[hospital.is_active ? "active" : "inactive"];

  return (
    <DataCard
      title={hospital.name}
      subtitle={hospital.registration_number ? `Reg: ${hospital.registration_number}` : hospital.city || "Hospital"}
      icon={<Building2 className="h-6 w-6" />}
      badge={<Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>}
      fields={[
        { label: "City", value: hospital.city || "—" },
        { label: "Patients", value: patientCount },
        { label: "Staff Members", value: staffCount },
        { label: "Onboarded", value: onboardedDate },
      ]}
      actions={
        hospital.is_active ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDeactivate(hospital.id)}
            disabled={isDeactivating}
            icon={<PowerOff className="h-3.5 w-3.5" />}
          >
            Suspend
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onActivate(hospital.id)}
            disabled={isActivating}
            icon={<Power className="h-3.5 w-3.5" />}
          >
            Activate
          </Button>
        )
      }
    />
  );
});

HospitalCard.displayName = "HospitalCard";

export default HospitalCard;
