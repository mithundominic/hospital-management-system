// Responsibility: Fetch and format encounters as select options for lab orders

import { useQuery } from "@tanstack/react-query";
import { getHospitalEncounters } from "@/services/encounter.service";
import { QUERY_KEYS } from "@/constants";
import type { LabEncounterOption } from "./lab.types";

export const useLabEncounters = (hospitalId?: string): LabEncounterOption[] => {
  const { data: encounters = [] } = useQuery({
    queryKey: QUERY_KEYS.hospitals.encounters(hospitalId),
    queryFn: async () => {
      if (!hospitalId) return [];
      const records = await getHospitalEncounters(hospitalId);
      return records.map((e) => ({
        id: e.id,
        chief_complaint: e.chief_complaint,
      }));
    },
    enabled: !!hospitalId,
  });

  return [
    { value: "", label: "Select Encounter" },
    ...encounters.map((e) => ({
      value: e.id,
      label: e.chief_complaint || `Encounter #${e.id.slice(0, 8)}`,
    })),
  ];
};
