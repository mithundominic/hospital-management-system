// Responsibility: HTTP API calls and data transport for laboratory orders and results

import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants";
import type { LabOrder } from "@/types";
import type { LabOrderFormData } from "@/pages/lab/useLabOrderForm";

export const getHospitalLabOrders = async (
  hospitalId: string,
): Promise<LabOrder[]> => {
  const data = await api.get<LabOrder[]>(
    API_ROUTES.hospitals.labOrders(hospitalId),
  );
  return data || [];
};

export const createHospitalLabOrder = async (
  hospitalId: string,
  data: LabOrderFormData,
): Promise<LabOrder> => {
  return api.post<LabOrder>(API_ROUTES.hospitals.labOrders(hospitalId), data);
};

export const updateHospitalLabOrder = async (
  hospitalId: string,
  orderId: string,
  data: Partial<LabOrderFormData>,
): Promise<LabOrder> => {
  return api.patch<LabOrder>(
    API_ROUTES.hospitals.labOrder(hospitalId, orderId),
    data,
  );
};
