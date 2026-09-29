// Responsibility: Manage encounters page state, visit queries, and modal management

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { getHospitalEncounters } from "@/services/encounter.service";
import { QUERY_KEYS } from "@/constants";
import type { Encounter } from "@/types";

export const useEncountersPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: encounters = [],
    isLoading,
    refetch,
  } = useQuery<Encounter[]>({
    queryKey: QUERY_KEYS.hospitals.encounters(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalEncounters(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return {
    encounters,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } as const;
};
