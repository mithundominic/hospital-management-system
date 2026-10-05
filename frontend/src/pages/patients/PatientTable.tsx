// Responsibility: Render the patients data table or cards grid using reusable DataTable
import { UserCircle } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { PATIENT_TABLE_COLUMNS } from "./patient.config";
import { PatientTableRow } from "./PatientTableRow";
import { PatientCard } from "./PatientCard";
import type { Patient } from "@/types";
import type { ViewMode } from "@/types/table.types";

export interface PatientTableProps {
  patients: (Patient & { hospital_patient_number?: string })[];
  viewMode?: ViewMode;
  isLoading?: boolean;
  onEdit: (p: Patient) => void;
  onSelect: (id: string) => void;
  onRegister: () => void;
}

export const PatientTable = ({
  patients,
  viewMode,
  isLoading,
  onEdit,
  onSelect,
  onRegister,
}: PatientTableProps) => (
  <DataTable
    columns={PATIENT_TABLE_COLUMNS}
    data={patients}
    viewMode={viewMode}
    isLoading={isLoading}
    emptyIcon={UserCircle}
    emptyTitle="No patients found"
    emptyDescription="Get started by registering your first patient."
    emptyActionLabel="Register Patient"
    onEmptyAction={onRegister}
    renderRow={(patient) => (
      <PatientTableRow
        key={patient.id}
        patient={patient}
        onEdit={onEdit}
        onSelect={onSelect}
      />
    )}
    renderCard={(patient) => (
      <PatientCard
        key={patient.id}
        patient={patient}
        onEdit={onEdit}
        onSelect={onSelect}
      />
    )}
  />
);

export default PatientTable;
