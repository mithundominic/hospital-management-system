// Responsibility: Render the patients data table or empty state

import { UserCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/Table';
import { EmptyState } from '@/components/common/EmptyState';
import { PatientTableRow } from './PatientTableRow';
import type { Patient } from '@/types';

export interface PatientTableProps {
  patients: (Patient & { hospital_patient_number?: string })[];
  onEdit: (p: Patient) => void;
  onSelect: (id: string) => void;
  onRegister: () => void;
}

export const PatientTable = ({ patients, onEdit, onSelect, onRegister }: PatientTableProps) => {
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
        <TableHeader>
          <TableRow>
            <TableHead>MRN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
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
