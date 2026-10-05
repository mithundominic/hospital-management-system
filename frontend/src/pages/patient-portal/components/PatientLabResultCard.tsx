// Responsibility: Render individual patient lab result in card grid view
import { memo } from "react";
import { TestTube } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { labResultStatusConfig } from "../patientPortal.config";
import type { PatientLabResult } from "../patientPortal.types";

export interface PatientLabResultCardProps {
  result: PatientLabResult;
}

export const PatientLabResultCard = memo(({
  result,
}: PatientLabResultCardProps) => {
  const statusConfig = labResultStatusConfig[result.status];
  const dateStr = new Date(result.result_date).toLocaleDateString();

  return (
    <DataCard
      title={result.test_name}
      subtitle={dateStr}
      icon={<TestTube className="h-6 w-6" />}
      badge={
        <Badge className={statusConfig.indicator}>
          {statusConfig.label}
        </Badge>
      }
      fields={[
        { label: "Result Value", value: result.result_value },
        { label: "Reference Range", value: result.reference_range || "N/A" },
      ]}
    />
  );
});

PatientLabResultCard.displayName = "PatientLabResultCard";

export default PatientLabResultCard;
