// Responsibility: Manage health records linking page state, patient param, and encounters query

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHospitalEncounters } from "@/services/encounter.service";
import { QUERY_KEYS } from "@/constants";
import { useHospital } from "@/contexts/HospitalContext";
import type { AbdmEncounter } from "../abdm.types";

export const useHealthRecordsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentHospital } = useHospital();
  const [selectedEncounter, setSelectedEncounter] = useState<string>();

  const { data: encounters = [], isLoading } = useQuery<AbdmEncounter[]>({
    queryKey: QUERY_KEYS.hospitals.encounters(currentHospital?.id, patientId),
    enabled: !!currentHospital && !!patientId,
    queryFn: async () => {
      if (!currentHospital || !patientId) return [];
      return (await getHospitalEncounters(
        currentHospital.id,
        patientId,
      )) as unknown as AbdmEncounter[];
    },
  });

  return {
    patientId,
    encounters,
    isLoading,
    selectedEncounter,
    setSelectedEncounter,
  } as const;
};
