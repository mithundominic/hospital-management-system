// Responsibility: Modal form for requesting new appointments

import { useState } from "react";
import { FormModal } from "@/components/common/FormModal";
import { useRequestAppointment } from "../hooks/usePatientPortal";
import { AppointmentRequestFields } from "./AppointmentRequestFields";
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

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
      <AppointmentRequestFields
        formData={formData}
        registrations={registrations}
        onChange={handleFieldChange}
      />
    </FormModal>
  );
};
