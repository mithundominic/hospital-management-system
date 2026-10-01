// Responsibility: Table displaying patient appointments

import { Table, Badge, Text } from "@/components/ui";
import type { PatientAppointment } from "../patientPortal.types";
import { appointmentStatusConfig } from "../patientPortal.config";

interface PatientAppointmentsTableProps {
  appointments: PatientAppointment[];
}

export const PatientAppointmentsTable = ({
  appointments,
}: PatientAppointmentsTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Doctor</th>
          <th>Department</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((apt) => (
          <tr key={apt.id}>
            <td>{new Date(apt.appointment_date).toLocaleDateString()}</td>
            <td>{apt.appointment_time}</td>
            <td>
              {apt.doctor_membership?.doctor?.full_name || "N/A"}
              {apt.doctor_membership?.doctor?.specialization && (
                <Text as="span" size="sm" variant="muted">
                  {" "}
                  ({apt.doctor_membership.doctor.specialization})
                </Text>
              )}
            </td>
            <td>{apt.department?.name || "N/A"}</td>
            <td>
              <Badge color={appointmentStatusConfig[apt.status].color}>
                {appointmentStatusConfig[apt.status].label}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
