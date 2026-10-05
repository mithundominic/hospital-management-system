// Responsibility: Render individual patient appointment in card grid view
import { memo } from "react";
import { Calendar } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { appointmentStatusConfig } from "../patientPortal.config";
import type { PatientAppointment } from "../patientPortal.types";

export interface PatientAppointmentCardProps {
  appointment: PatientAppointment;
}

export const PatientAppointmentCard = memo(({
  appointment: apt,
}: PatientAppointmentCardProps) => {
  const doctorName =
    apt.doctor_membership?.doctor?.full_name || "Doctor Consultation";
  const dateStr = new Date(apt.appointment_date).toLocaleDateString();

  return (
    <DataCard
      title={doctorName}
      subtitle={apt.department?.name || "General OPD"}
      icon={<Calendar className="h-6 w-6" />}
      badge={
        <Badge color={appointmentStatusConfig[apt.status].color}>
          {appointmentStatusConfig[apt.status].label}
        </Badge>
      }
      fields={[
        { label: "Date", value: dateStr },
        { label: "Time", value: apt.appointment_time },
        ...(apt.doctor_membership?.doctor?.specialization
          ? [
              {
                label: "Specialization",
                value: apt.doctor_membership.doctor.specialization,
              },
            ]
          : []),
      ]}
    />
  );
});

PatientAppointmentCard.displayName = "PatientAppointmentCard";

export default PatientAppointmentCard;
