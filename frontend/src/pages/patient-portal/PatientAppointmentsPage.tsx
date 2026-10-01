// Responsibility: Patient appointments list and request interface

import { useState } from "react";
import { Box, Button, Card, Heading, Text } from "@/components/ui";
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
        <Text>Loading appointments...</Text>
      </Box>
    );
  }

  const defaultRegistrationId = registrations?.[0]?.id;

  return (
    <Box className="p-6 space-y-6">
      <Box className="flex justify-between items-center">
        <Heading>My Appointments</Heading>
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
          <Text className="text-center py-8" variant="muted">
            No appointments found.
          </Text>
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
