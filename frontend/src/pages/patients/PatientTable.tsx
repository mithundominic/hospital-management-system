// Responsibility: Render the patients data table or empty state

import { UserCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody } from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { PATIENT_TABLE_COLUMNS } from "./patient.config";
import { PatientTableRow } from "./PatientTableRow";
import type { Patient } from "@/types";

export interface PatientTableProps {
  patients: (Patient & { hospital_patient_number?: string })[];
  onEdit: (p: Patient) => void;
  onSelect: (id: string) => void;
  onRegister: () => void;
}

export const PatientTable = ({
  patients,
  onEdit,
  onSelect,
  onRegister,
}: PatientTableProps) => {
  if (patients.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={UserCircle}
          title="No patients found"
          description="Get started by registering your first patient."
          actionLabel="Register Patient"
          onAction={onRegister}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <DataTableHeader columns={PATIENT_TABLE_COLUMNS} />
        <TableBody>
          {patients.map((patient) => (
            <PatientTableRow
              key={patient.id}
              patient={patient}
              onEdit={onEdit}
              onSelect={onSelect}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default PatientTable;
