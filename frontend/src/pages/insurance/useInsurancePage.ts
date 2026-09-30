// Responsibility: Manage insurance page state and claims query

import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import { getHospitalInsuranceClaims } from "@/services/insurance.service";
import { QUERY_KEYS } from "@/constants";
import type { InsuranceClaim } from "@/types";

export const useInsurancePage = () => {
  const { currentHospital } = useHospital();

  const { data: claims = [], isLoading } = useQuery<InsuranceClaim[]>({
    queryKey: QUERY_KEYS.hospitals.insuranceClaims(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalInsuranceClaims(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  return {
    claims,
    isLoading,
  } as const;
};
