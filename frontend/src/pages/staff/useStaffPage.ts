// Responsibility: Manage staff page state, memberships querying, and modal management

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import {
  getHospitalMemberships,
  type MembershipDto,
} from "@/services/staff.service";
import { QUERY_KEYS } from "@/constants";

export const useStaffPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: memberships = [],
    isLoading,
    refetch,
  } = useQuery<MembershipDto[]>({
    queryKey: QUERY_KEYS.hospitals.memberships(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalMemberships(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return {
    memberships,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } as const;
};
