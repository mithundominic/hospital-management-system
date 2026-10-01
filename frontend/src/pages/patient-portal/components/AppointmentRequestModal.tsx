// Responsibility: Modal form for requesting new appointments

import { useState } from "react";
import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useRequestAppointment } from "../hooks/usePatientPortal";
import toast from "react-hot-toast";
import type { PatientRegistration } from "../patientPortal.types";

interface AppointmentRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  patientRegistrationId: string;
  registrations: PatientRegistration[];
}

export const AppointmentRequestModal = ({
  onClose,
  onSuccess,
  patientRegistrationId,
  registrations,
}: AppointmentRequestModalProps) => {
  const [formData, setFormData] = useState({
    patient_registration_id: patientRegistrationId,
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  const { mutate, isPending } = useRequestAppointment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        toast.success("Appointment request submitted successfully");
        onSuccess();
        onClose();
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Request failed";
        toast.error(msg);
      },
    });
  };

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title="Request Appointment"
      onSubmit={handleSubmit}
      submitLabel="Submit Request"
      isLoading={isPending}
    >
      <Box className="space-y-4">
        {registrations.length > 1 && (
          <Select
            label="Hospital *"
            required
            value={formData.patient_registration_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                patient_registration_id: e.target.value,
              })
            }
          >
            {registrations.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.hospital?.name || "Unknown Hospital"}
              </option>
            ))}
          </Select>
        )}
        <Input
          label="Preferred Date *"
          type="date"
          required
          value={formData.appointment_date}
          onChange={(e) =>
            setFormData({ ...formData, appointment_date: e.target.value })
          }
        />
        <Input
          label="Preferred Time *"
          type="time"
          required
          value={formData.appointment_time}
          onChange={(e) =>
            setFormData({ ...formData, appointment_time: e.target.value })
          }
        />
        <Textarea
          label="Reason for Visit"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows={3}
        />
      </Box>
    </FormModal>
  );
};
