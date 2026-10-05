// Responsibility: Display patient appointments in table or cards view using reusable DataTable
import { Calendar } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { DataTable } from "@/components/common/DataTable";
import { PatientAppointmentCard } from "./PatientAppointmentCard";
import type { PatientAppointment } from "../patientPortal.types";
import { appointmentStatusConfig } from "../patientPortal.config";

const APPOINTMENT_COLUMNS = [
  { key: "date", header: "Date" },
  { key: "time", header: "Time" },
  { key: "doctor", header: "Doctor" },
  { key: "department", header: "Department" },
  { key: "status", header: "Status" },
] as const;

interface PatientAppointmentsTableProps {
  appointments: PatientAppointment[];
}

export const PatientAppointmentsTable = ({
  appointments,
}: PatientAppointmentsTableProps) => (
  <DataTable
    columns={APPOINTMENT_COLUMNS}
    data={appointments}
    showViewToggle={true}
    emptyIcon={Calendar}
    emptyTitle="No appointments found"
    emptyDescription="Your scheduled appointments will appear here."
    containerClassName="max-h-[460px] overflow-auto"
    renderRow={(apt) => (
      <TableRow key={apt.id}>
        <TableCell>{new Date(apt.appointment_date).toLocaleDateString()}</TableCell>
        <TableCell>{apt.appointment_time}</TableCell>
        <TableCell>
          {apt.doctor_membership?.doctor?.full_name || "N/A"}
          {apt.doctor_membership?.doctor?.specialization && (
            <Text as="span" size="sm" variant="muted">
              {" "}
              ({apt.doctor_membership.doctor.specialization})
            </Text>
          )}
        </TableCell>
        <TableCell>{apt.department?.name || "N/A"}</TableCell>
        <TableCell>
          <Badge color={appointmentStatusConfig[apt.status].color}>
            {appointmentStatusConfig[apt.status].label}
          </Badge>
        </TableCell>
      </TableRow>
    )}
    renderCard={(apt) => (
      <PatientAppointmentCard key={apt.id} appointment={apt} />
    )}
  />
);

export default PatientAppointmentsTable;
