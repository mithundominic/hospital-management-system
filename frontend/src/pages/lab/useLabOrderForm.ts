// Responsibility: Manage lab order form state, encounter selection, and submission logic

import { useState, useCallback, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type { LabOrder } from "@/types";

export interface LabOrderFormData {
  encounter_id: string;
  test_name: string;
  sample_type: string;
  priority: "routine" | "urgent" | "stat";
  instructions: string;
}

export const useLabOrderForm = (
  onClose: () => void,
  onSuccess: () => void,
  labOrder?: LabOrder | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LabOrderFormData>({
    encounter_id: labOrder?.encounter_id || "",
    test_name: labOrder?.test_name || "",
    sample_type: "blood",
    priority: labOrder?.priority || "routine",
    instructions: "",
  });

  const { data: encounters = [] } = useQuery<
    { id: string; chief_complaint?: string }[]
  >({
    queryKey: QUERY_KEYS.hospitals.encounters(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<{ id: string; chief_complaint?: string }[]>(
        API_ROUTES.hospitals.encounters(currentHospital.id),
      );
    },
    enabled: !!currentHospital,
  });

  const updateField = useCallback(
    <K extends keyof LabOrderFormData>(key: K, val: LabOrderFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        if (labOrder?.id) {
          await api.patch(API_ROUTES.hospitals.labOrder(currentHospital.id, labOrder.id), formData);
          toast.success("Lab order updated successfully");
        } else {
          await api.post(API_ROUTES.hospitals.labOrders(currentHospital.id), formData);
          toast.success("Lab order created successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save lab order";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, labOrder, onSuccess, onClose],
  );

  const encounterOptions = [
    { value: "", label: "Select Encounter" },
    ...encounters.map((e) => ({
      value: e.id,
      label: e.chief_complaint || `Encounter #${e.id.slice(0, 8)}`,
    })),
  ];

  return { loading, formData, updateField, encounterOptions, handleSubmit } as const;
};
