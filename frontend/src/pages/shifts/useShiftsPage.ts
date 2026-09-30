// Responsibility: Manage shifts page state, schedule date math, and shift queries

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek, addDays } from "date-fns";
import { useHospital } from "@/contexts/useHospital";
import { getHospitalShifts } from "@/services/shift.service";
import { QUERY_KEYS } from "@/constants";
import type { Shift } from "@/types";

export const useShiftsPage = () => {
  const { currentHospital } = useHospital();
  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    [],
  );
  const [showModal, setShowModal] = useState(false);

  const {
    data: shifts = [],
    isLoading,
    refetch,
  } = useQuery<Shift[]>({
    queryKey: QUERY_KEYS.hospitals.shifts(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalShifts(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return {
    shifts,
    isLoading,
    weekStart,
    weekDays,
    showModal,
    openModal,
    closeModal,
    refetch,
  } as const;
};
