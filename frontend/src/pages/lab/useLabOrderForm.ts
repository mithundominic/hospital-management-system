// Responsibility: Manage lab order form state, validation, and submission logic

import { useState, useCallback, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import {
  createHospitalLabOrder,
  updateHospitalLabOrder,
} from "@/services/lab.service";
import type { LabOrder } from "@/types";
import type { LabOrderFormData } from "./lab.types";
import { useLabEncounters } from "./useLabEncounters";

export { type LabOrderFormData } from "./lab.types";

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
    priority: (labOrder?.priority === "urgent" || labOrder?.priority === "stat") ? labOrder.priority : "routine",
    instructions: "",
  });

  const encounterOptions = useLabEncounters(currentHospital?.id);

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
          await updateHospitalLabOrder(
            currentHospital.id,
            labOrder.id,
            formData,
          );
          toast.success("Lab order updated successfully");
        } else {
          await createHospitalLabOrder(currentHospital.id, formData);
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

  return {
    loading,
    formData,
    updateField,
    encounterOptions,
    handleSubmit,
  } as const;
};
