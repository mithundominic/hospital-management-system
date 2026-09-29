// Responsibility: Fetch and format patient and doctor options for clinical encounters

import { useQuery } from "@tanstack/react-query";
import { getHospitalPatients } from "@/services/patient.service";
import { getHospitalDoctors } from "@/services/appointment.service";
import { QUERY_KEYS } from "@/constants";

export const useEncounterOptions = (hospitalId?: string) => {
  const { data: patients = [] } = useQuery<{ id: string; full_name: string }[]>(
    {
      queryKey: QUERY_KEYS.hospitals.patients(hospitalId),
      queryFn: async () => {
        if (!hospitalId) return [];
        const records = await getHospitalPatients(hospitalId);
        return records.map((r) => ({
          id: r.patients.id,
          full_name: r.patients.full_name,
        }));
      },
      enabled: !!hospitalId,
    },
  );

  const { data: doctors = [] } = useQuery<
    { id: string; specialization?: string }[]
  >({
    queryKey: QUERY_KEYS.hospitals.doctors(hospitalId),
    queryFn: async () => {
      if (!hospitalId) return [];
      const records = await getHospitalDoctors(hospitalId);
      return records.map((d) => ({
        id: d.id,
        specialization: d.specialization,
      }));
    },
    enabled: !!hospitalId,
  });

  return { patients, doctors } as const;
};
