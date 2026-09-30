// Responsibility: Patient appointments list and request interface

import { useState } from "react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useMyAppointments } from "./hooks/usePatientPortal";
import { PatientAppointmentsTable } from "./components/PatientAppointmentsTable";
import { AppointmentRequestModal } from "./components/AppointmentRequestModal";

export const PatientAppointmentsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: appointments, isLoading, refetch } = useMyAppointments();

  // TODO: Get actual patient registration ID from context or user profile
  const patientRegistrationId = "temp-id";

  if (isLoading) {
    return (
      <Box className="p-6">
        <p>Loading appointments...</p>
      </Box>
    );
  }

  return (
    <Box className="p-6 space-y-6">
      <Box className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Button onClick={() => setShowModal(true)}>Request Appointment</Button>
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

      {showModal && (
        <AppointmentRequestModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
          patientRegistrationId={patientRegistrationId}
        />
      )}
    </Box>
  );
};

export default PatientAppointmentsPage;
