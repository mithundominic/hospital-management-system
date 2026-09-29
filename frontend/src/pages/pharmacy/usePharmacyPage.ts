// Responsibility: Manage pharmacy page state, inventory querying, and stock metric calculations

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { getHospitalInventory } from "@/services/pharmacy.service";
import { QUERY_KEYS } from "@/constants";
import {
  filterLowStockItems,
  computeTotalInventoryValue,
} from "./pharmacy.utils";
import type { InventoryItem } from "@/types";

export const usePharmacyPage = () => {
  const { currentHospital } = useHospital();

  const { data: inventory = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: QUERY_KEYS.hospitals.inventory(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalInventory(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const lowStock = useMemo(() => filterLowStockItems(inventory), [inventory]);

  const totalValue = useMemo(
    () => computeTotalInventoryValue(inventory),
    [inventory],
  );

  return {
    inventory,
    isLoading,
    lowStock,
    totalValue,
  } as const;
};
