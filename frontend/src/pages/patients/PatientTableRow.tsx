// Responsibility: Render individual patient table row with MRN, age, and quick edit action

import { memo } from "react";
import { Edit, UserCircle } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { calculateAge } from "./patient.utils";
import type { Patient } from "@/types";

export interface PatientTableRowProps {
  patient: Patient & { hospital_patient_number?: string };
  onEdit: (p: Patient) => void;
  onSelect: (id: string) => void;
}

export const PatientTableRow = memo(({
  patient,
  onEdit,
  onSelect,
}: PatientTableRowProps) => {
  return (
    <TableRow className="cursor-pointer">
      <TableCell onClick={() => onSelect(patient.id)}>
        <Text weight="semibold" className="text-primary-600 font-mono">
          {patient.hospital_patient_number || "N/A"}
        </Text>
      </TableCell>
      <TableCell onClick={() => onSelect(patient.id)}>
        <Flex align="center" gap={3}>
          <UserCircle className="h-8 w-8 text-gray-400" />
          <Box>
            <Text weight="medium">{patient.full_name}</Text>
            <Text size="xs" variant="muted">
              {patient.gender}
            </Text>
          </Box>
        </Flex>
      </TableCell>
      <TableCell onClick={() => onSelect(patient.id)}>
        <Text size="sm">{calculateAge(patient.dob)} yrs</Text>
      </TableCell>
      <TableCell onClick={() => onSelect(patient.id)}>
        <Text size="sm">{patient.phone || "N/A"}</Text>
      </TableCell>
      <TableCell onClick={() => onSelect(patient.id)}>
        {patient.blood_group ? (
          <Badge variant="purple">{patient.blood_group}</Badge>
        ) : (
          <Text size="sm" variant="muted">
            N/A
          </Text>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(patient);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

PatientTableRow.displayName = "PatientTableRow";

export default PatientTableRow;
