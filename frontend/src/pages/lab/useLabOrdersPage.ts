// Responsibility: Manage lab orders page state, orders querying, and modal management

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { getHospitalLabOrders } from "@/services/lab.service";
import { QUERY_KEYS } from "@/constants";
import type { LabOrder } from "@/types";

export const useLabOrdersPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: labOrders = [],
    isLoading,
    refetch,
  } = useQuery<LabOrder[]>({
    queryKey: QUERY_KEYS.hospitals.labOrders(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalLabOrders(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return {
    labOrders,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } as const;
};
