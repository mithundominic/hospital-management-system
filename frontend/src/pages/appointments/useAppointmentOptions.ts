// Responsibility: Fetch and format patient and doctor options for appointment scheduling

import { useQuery } from "@tanstack/react-query";
import { getHospitalDoctors } from "@/services/appointment.service";
import { getHospitalPatients } from "@/services/patient.service";
import { QUERY_KEYS } from "@/constants";
import type { PatientOption, DoctorOption } from "./appointment.types";

export const useAppointmentOptions = (hospitalId?: string) => {
  const { data: patients = [] } = useQuery<PatientOption[]>({
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
  });

  const { data: doctors = [] } = useQuery<DoctorOption[]>({
    queryKey: QUERY_KEYS.hospitals.doctors(hospitalId),
    queryFn: async () => {
      if (!hospitalId) return [];
      return await getHospitalDoctors(hospitalId);
    },
    enabled: !!hospitalId,
  });

  return { patients, doctors } as const;
};
