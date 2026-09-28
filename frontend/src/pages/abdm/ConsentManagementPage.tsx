// Responsibility: Consent management dashboard for requesting and viewing patient consent artifacts

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useHospital } from "@/contexts/HospitalContext";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConsentRequestForm } from "./components/ConsentRequestForm";
import { ConsentArtifactsList } from "./components/ConsentArtifactsList";
import type { Patient } from "@/types";
import type { ConsentArtifact } from "./abdm.types";

export default function ConsentManagementPage() {
  const { currentHospital } = useHospital();
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["patients", currentHospital?.id],
    enabled: !!currentHospital,
    queryFn: async () => {
      if (!currentHospital) return [];
      return api.get<Patient[]>(`/hospitals/${currentHospital.id}/patients`);
    },
  });

  const { data: consentArtifacts = [], isLoading: consentsLoading } = useQuery<
    ConsentArtifact[]
  >({
    queryKey: ["consent-artifacts", currentHospital?.id, selectedPatient],
    enabled: !!currentHospital && !!selectedPatient,
    queryFn: async () => {
      if (!currentHospital || !selectedPatient) return [];
      return api.get<ConsentArtifact[]>(
        `/hospitals/${currentHospital.id}/patients/${selectedPatient}/abdm/consents`,
      );
    },
  });

  const patientOptions = [
    { value: "", label: "Select Patient" },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Consent Management"
        description="Manage patient health data sharing consent and inspect active ABDM artifacts."
      />
      <Card className="p-6">
        <Select
          label="Select Patient"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          options={patientOptions}
        />
      </Card>
      {selectedPatient && (
        <Box className="space-y-6">
          <ConsentRequestForm patientId={selectedPatient} />
          {consentsLoading ? (
            <LoadingSpinner size="md" />
          ) : (
            <ConsentArtifactsList artifacts={consentArtifacts} />
          )}
        </Box>
      )}
    </Box>
  );
}
