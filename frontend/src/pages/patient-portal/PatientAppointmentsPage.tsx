// Responsibility: Patient appointments list and request interface

import { useState } from "react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  useMyAppointments,
  useMyRegistrations,
} from "./hooks/usePatientPortal";
import { PatientAppointmentsTable } from "./components/PatientAppointmentsTable";
import { AppointmentRequestModal } from "./components/AppointmentRequestModal";

export const PatientAppointmentsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: appointments, isLoading, refetch } = useMyAppointments();
  const { data: registrations, isLoading: isLoadingRegistrations } =
    useMyRegistrations();

  if (isLoading || isLoadingRegistrations) {
    return (
      <Box className="p-6">
        <p>Loading appointments...</p>
      </Box>
    );
  }

  const defaultRegistrationId = registrations?.[0]?.id;

  return (
    <Box className="p-6 space-y-6">
      <Box className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Button
          onClick={() => setShowModal(true)}
          disabled={!defaultRegistrationId}
        >
          Request Appointment
        </Button>
      </Box>

      <Card className="p-6">
        {appointments && appointments.length > 0 ? (
          <PatientAppointmentsTable appointments={appointments} />
        ) : (
          <p className="text-center text-gray-500 py-8">
            No appointments found.
          </p>
        )}
      </Card>

      {showModal && defaultRegistrationId && (
        <AppointmentRequestModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
          patientRegistrationId={defaultRegistrationId}
          registrations={registrations || []}
        />
      )}
    </Box>
  );
};

export default PatientAppointmentsPage;
