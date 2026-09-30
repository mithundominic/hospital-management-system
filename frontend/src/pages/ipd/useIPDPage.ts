// Responsibility: Manage IPD page state, bed inventory queries, and admission modal control

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import { getHospitalBeds } from "@/services/ipd.service";
import { QUERY_KEYS } from "@/constants";
import type { Bed } from "@/types";

export const useIPDPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: beds = [],
    isLoading,
    refetch,
  } = useQuery<Bed[]>({
    queryKey: QUERY_KEYS.hospitals.beds(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalBeds(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return {
    beds,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } as const;
};
