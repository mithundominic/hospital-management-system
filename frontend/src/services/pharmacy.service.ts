// Responsibility: HTTP API calls and transport for pharmacy inventory and transactions

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { InventoryItem } from "@/types";

export const getHospitalInventory = async (
  hospitalId: string,
): Promise<InventoryItem[]> => {
  const data = await api.get<InventoryItem[]>(
    API_ROUTES.hospitals.inventory(hospitalId),
  );
  return data || [];
};
