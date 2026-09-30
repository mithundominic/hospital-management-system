// Responsibility: Patient lab results viewing interface

import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { useMyLabResults } from "./hooks/usePatientPortal";
import { PatientLabResultsTable } from "./components/PatientLabResultsTable";

export const PatientLabResultsPage = () => {
  const { data: labResults, isLoading } = useMyLabResults();

  if (isLoading) {
    return (
      <Box className="p-6">
        <p>Loading lab results...</p>
      </Box>
    );
  }

  return (
    <Box className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Lab Results</h1>

      <Card className="p-6">
        {labResults && labResults.length > 0 ? (
          <PatientLabResultsTable labResults={labResults} />
        ) : (
          <p className="text-center text-gray-500 py-8">
            No lab results found.
          </p>
        )}
      </Card>
    </Box>
  );
};

export default PatientLabResultsPage;
