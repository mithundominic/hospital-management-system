// Responsibility: Fetch and format patients, available beds, and doctors for IPD admissions

import { useQuery } from "@tanstack/react-query";
import { getHospitalBeds } from "@/services/ipd.service";
import { getHospitalPatients } from "@/services/patient.service";
import { getHospitalDoctors } from "@/services/appointment.service";
import { QUERY_KEYS, BED_STATUS } from "@/constants";
import type { Bed } from "@/types";

export const useAdmissionOptions = (
  hospitalId?: string,
  currentBedId?: string,
) => {
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

  const { data: beds = [] } = useQuery<Bed[]>({
    queryKey: QUERY_KEYS.hospitals.beds(hospitalId),
    queryFn: async () => {
      if (!hospitalId) return [];
      const allBeds = await getHospitalBeds(hospitalId);
      return allBeds.filter(
        (b) => b.status === BED_STATUS.AVAILABLE || b.id === currentBedId,
      );
    },
    enabled: !!hospitalId,
  });

  const { data: doctors = [] } = useQuery<
    { id: string; specialization?: string }[]
  >({
    queryKey: QUERY_KEYS.hospitals.doctors(hospitalId),
    queryFn: async () => {
      if (!hospitalId) return [];
      return await getHospitalDoctors(hospitalId);
    },
    enabled: !!hospitalId,
  });

  return { patients, beds, doctors } as const;
};
