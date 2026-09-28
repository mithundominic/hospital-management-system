// Responsibility: Detailed profile page for single patient showing demographics and clinical history

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, TestTube, Pill } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Text } from "@/components/ui/Text";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PatientDetailHeader } from "./PatientDetailHeader";
import { PatientClinicalSectionCard } from "./PatientClinicalSectionCard";
import { PatientQuickActionsCard } from "./PatientQuickActionsCard";
import type { Patient } from "@/types";

export const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentHospital } = useHospital();

  const { data: patient, isLoading } = useQuery<Patient | null>({
    queryKey: QUERY_KEYS.hospitals.patientDetail(currentHospital?.id, id),
    queryFn: async () => {
      if (!currentHospital || !id) return null;
      return await api.get<Patient>(
        API_ROUTES.hospitals.patient(currentHospital.id, id),
      );
    },
    enabled: !!currentHospital && !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!patient) {
    return (
      <Box className="text-center py-12">
        <Text variant="muted">Patient not found</Text>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <PatientDetailHeader patient={patient} />

      <Grid cols={3} gap={6}>
        <Box className="lg:col-span-2 space-y-6">
          <PatientClinicalSectionCard
            icon={FileText}
            title="Recent Encounters"
            emptyText="No encounters recorded yet"
          />
          <PatientClinicalSectionCard
            icon={TestTube}
            title="Lab Results"
            emptyText="No lab results available"
          />
        </Box>

        <Box className="space-y-6">
          <PatientQuickActionsCard />
          <PatientClinicalSectionCard
            icon={Pill}
            title="Prescriptions"
            emptyText="No active prescriptions"
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default PatientDetailPage;
