// Responsibility: Display hospitals in table format with sorting and actions
 
import { Card } from "@/components/ui/Card";
import { Table, TableBody } from "@/components/ui/Table";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { HospitalTableRow } from "./HospitalTableRow";
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
}: HospitalsTableProps) => {
  return (
    <Card className="overflow-hidden">
      <Table>
        <DataTableHeader columns={HOSPITALS_TABLE_COLUMNS} />
        <TableBody>
          {hospitals.map((hospital) => (
            <HospitalTableRow
              key={hospital.id}
              hospital={hospital}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              isActivating={isActivating}
              isDeactivating={isDeactivating}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
