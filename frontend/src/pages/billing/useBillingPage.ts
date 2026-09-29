// Responsibility: Manage billing page state, invoice querying, and modal management

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { getHospitalInvoices } from "@/services/billing.service";
import { QUERY_KEYS } from "@/constants";
import type { Invoice } from "@/types";

export const useBillingPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: invoices = [],
    isLoading,
    refetch,
  } = useQuery<Invoice[]>({
    queryKey: QUERY_KEYS.hospitals.invoices(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalInvoices(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return {
    invoices,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } as const;
};
