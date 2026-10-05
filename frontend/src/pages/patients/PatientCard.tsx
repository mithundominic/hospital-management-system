// Responsibility: Render individual patient card with MRN, age, phone, blood group, and quick actions
import { memo } from "react";
import { Edit, UserCircle } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { calculateAge } from "./patient.utils";
import type { Patient } from "@/types";

export interface PatientCardProps {
  patient: Patient & { hospital_patient_number?: string };
  onEdit: (p: Patient) => void;
  onSelect: (id: string) => void;
}

export const PatientCard = memo(({
  patient,
  onEdit,
  onSelect,
}: PatientCardProps) => {
  const age = calculateAge(patient.dob);

  return (
    <DataCard
      title={patient.full_name}
      subtitle={`MRN: ${patient.hospital_patient_number || "N/A"}`}
      icon={<UserCircle className="h-6 w-6" />}
      badge={
        patient.blood_group ? (
          <Badge variant="purple">{patient.blood_group}</Badge>
        ) : undefined
      }
      fields={[
        { label: "Gender / Age", value: `${patient.gender} • ${age} yrs` },
        { label: "Phone", value: patient.phone || "N/A" },
        { label: "Blood Group", value: patient.blood_group || "N/A" },
      ]}
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(patient);
            }}
            icon={<Edit className="h-3.5 w-3.5" />}
          >
            Edit
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(patient.id);
            }}
          >
            View Details
          </Button>
        </>
      }
      onClick={() => onSelect(patient.id)}
    />
  );
});

PatientCard.displayName = "PatientCard";

export default PatientCard;
