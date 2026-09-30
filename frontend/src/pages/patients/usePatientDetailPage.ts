// Responsibility: Manage patient detail page state, URL parameter parsing, profile queries, and active tab

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import { getHospitalPatientById } from "@/services/patient.service";
import { QUERY_KEYS } from "@/constants";
import type { Patient } from "@/types";
import type { PatientDetailTabId } from "./patient.config";

export const usePatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentHospital } = useHospital();
  const [activeTab, setActiveTab] = useState<PatientDetailTabId>("encounters");

  const { data: patient, isLoading } = useQuery<Patient | null>({
    queryKey: QUERY_KEYS.hospitals.patientDetail(currentHospital?.id, id),
    queryFn: async () => {
      if (!currentHospital || !id) return null;
      return await getHospitalPatientById(currentHospital.id, id);
    },
    enabled: !!currentHospital && !!id,
  });

  return {
    patient,
    isLoading,
    activeTab,
    setActiveTab,
  } as const;
};
