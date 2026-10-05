// Responsibility: Display hospitals in table or cards view using reusable DataTable
import { Building2 } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { HospitalTableRow } from "./HospitalTableRow";
import { HospitalCard } from "./HospitalCard";
import { HOSPITALS_TABLE_COLUMNS } from "./platform.config";
import type { PlatformHospital } from "@/types/platform";

interface HospitalsTableProps {
  hospitals: PlatformHospital[];
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  isActivating: boolean;
  isDeactivating: boolean;
}

export const HospitalsTable = ({
  hospitals,
  onActivate,
  onDeactivate,
  isActivating,
  isDeactivating,
}: HospitalsTableProps) => (
  <DataTable
    columns={HOSPITALS_TABLE_COLUMNS}
    data={hospitals}
    showViewToggle={true}
    emptyIcon={Building2}
    emptyTitle="No hospitals onboarded"
    emptyDescription="There are no hospitals in the system yet."
    renderRow={(hospital) => (
      <HospitalTableRow
        key={hospital.id}
        hospital={hospital}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        isActivating={isActivating}
        isDeactivating={isDeactivating}
      />
    )}
    renderCard={(hospital) => (
      <HospitalCard
        key={hospital.id}
        hospital={hospital}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        isActivating={isActivating}
        isDeactivating={isDeactivating}
      />
    )}
  />
);

export default HospitalsTable;
