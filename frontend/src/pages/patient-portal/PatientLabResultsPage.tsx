// Responsibility: Patient lab results viewing interface

import { Box, Card, Heading, Text } from "@/components/ui";
import { useMyLabResults } from "./hooks/usePatientPortal";
import { PatientLabResultsTable } from "./components/PatientLabResultsTable";

export const PatientLabResultsPage = () => {
  const { data: labResults, isLoading } = useMyLabResults();

  if (isLoading) {
    return (
      <Box className="p-6">
        <Text>Loading lab results...</Text>
      </Box>
    );
  }

  return (
    <Box className="p-6 space-y-6">
      <Heading>My Lab Results</Heading>

      <Card className="p-6">
        {labResults && labResults.length > 0 ? (
          <PatientLabResultsTable labResults={labResults} />
        ) : (
          <Text className="text-center py-8" variant="muted">
            No lab results found.
          </Text>
        )}
      </Card>
    </Box>
  );
};

export default PatientLabResultsPage;
