// Responsibility: Modal form for requesting new appointments

import { useState } from "react";
import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useRequestAppointment } from "../hooks/usePatientPortal";
import toast from "react-hot-toast";

interface AppointmentRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  patientRegistrationId: string;
}

export const AppointmentRequestModal = ({
  onClose,
  onSuccess,
  patientRegistrationId,
}: AppointmentRequestModalProps) => {
  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  const { mutate, isPending } = useRequestAppointment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        patient_registration_id: patientRegistrationId,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason,
      },
      {
        onSuccess: () => {
          toast.success("Appointment request submitted successfully");
          onSuccess();
          onClose();
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to request appointment",
          );
        },
      },
    );
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
