// Responsibility: Form fields for appointment request

import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { PatientRegistration } from "../patientPortal.types";

interface AppointmentRequestFieldsProps {
  formData: {
    patient_registration_id: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
  };
  registrations: PatientRegistration[];
  onChange: (field: string, value: string) => void;
}

export const AppointmentRequestFields = ({
  formData,
  registrations,
  onChange,
}: AppointmentRequestFieldsProps) => {
  return (
    <Box className="space-y-4">
      {registrations.length > 1 && (
        <Select
          label="Hospital *"
          required
          value={formData.patient_registration_id}
          onChange={(e) => onChange("patient_registration_id", e.target.value)}
          options={registrations.map((reg) => ({
            value: reg.id,
            label: reg.hospital?.name || "Unknown Hospital",
          }))}
        />
      )}
      <Input
        label="Preferred Date *"
        type="date"
        required
        value={formData.appointment_date}
        onChange={(e) => onChange("appointment_date", e.target.value)}
      />
      <Input
        label="Preferred Time *"
        type="time"
        required
        value={formData.appointment_time}
        onChange={(e) => onChange("appointment_time", e.target.value)}
      />
      <Textarea
        label="Reason for Visit"
        value={formData.reason}
        onChange={(e) => onChange("reason", e.target.value)}
        rows={3}
      />
    </Box>
  );
};
