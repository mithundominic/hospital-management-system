// Responsibility: Patient prescriptions viewing interface

import { Box } from "@/components/ui/Box";
import { useMyPrescriptions } from "./hooks/usePatientPortal";
import { PrescriptionCard } from "./components/PrescriptionCard";

export const PatientPrescriptionsPage = () => {
  const { data: prescriptions, isLoading } = useMyPrescriptions();

  if (isLoading) {
    return (
      <Box className="p-6">
        <p>Loading prescriptions...</p>
      </Box>
    );
  }

  return (
    <Box className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Prescriptions</h1>

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
        <Box className="text-center text-gray-500 py-8">
          No prescriptions found.
        </Box>
      )}
    </Box>
  );
};

export default PatientPrescriptionsPage;
