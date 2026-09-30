// Responsibility: Manage consent page state, patient options, consent queries, and active tab

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHospitalPatients,
  type PatientRecordItem,
} from "@/services/patient.service";
import { getConsentArtifacts } from "@/services/abdm.service";
import { QUERY_KEYS } from "@/constants";
import { useHospital } from "@/contexts/useHospital";
import type { ConsentArtifact } from "../abdm.types";
import type { ConsentTabId } from "../abdm.config";

export const useConsentManagementPage = () => {
  const { currentHospital } = useHospital();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ConsentTabId>("artifacts");

  const { data: patients = [] } = useQuery<PatientRecordItem[]>({
    queryKey: QUERY_KEYS.hospitals.patients(currentHospital?.id),
    enabled: !!currentHospital,
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalPatients(currentHospital.id);
    },
  });

  const { data: consentArtifacts = [], isLoading: consentsLoading } = useQuery<
    ConsentArtifact[]
  >({
    queryKey: QUERY_KEYS.hospitals.abdm.consentArtifacts(
      currentHospital?.id,
      selectedPatient,
    ),
    enabled: !!currentHospital && !!selectedPatient,
    queryFn: async () => {
      if (!currentHospital || !selectedPatient) return [];
      return await getConsentArtifacts(currentHospital.id, selectedPatient);
    },
  });

  const patientOptions = useMemo(
    () => [
      { value: "", label: "Select Patient" },
      ...patients.map((p) => ({
        value: p.patients.id,
        label: p.patients.full_name,
      })),
    ],
    [patients],
  );

  return {
    selectedPatient,
    setSelectedPatient,
    patientOptions,
    consentArtifacts,
    consentsLoading,
    activeTab,
    setActiveTab,
  } as const;
};
