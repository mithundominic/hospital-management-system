// Responsibility: Patient prescriptions viewing interface

import { Box, Heading, Text } from "@/components/ui";
import { useMyPrescriptions } from "./hooks/usePatientPortal";
import { PrescriptionCard } from "./components/PrescriptionCard";

export const PatientPrescriptionsPage = () => {
  const { data: prescriptions, isLoading } = useMyPrescriptions();

  if (isLoading) {
    return (
      <Box className="p-6">
        <Text>Loading prescriptions...</Text>
      </Box>
    );
  }

  return (
    <Box className="p-6 space-y-6">
      <Heading>My Prescriptions</Heading>

      {prescriptions && prescriptions.length > 0 ? (
        <Box className="space-y-4">
          {prescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          ))}
        </Box>
      ) : (
        <Text className="text-center py-8" variant="muted">
          No prescriptions found.
        </Text>
      )}
    </Box>
  );
};

export default PatientPrescriptionsPage;
