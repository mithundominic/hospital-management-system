// Responsibility: Manage prescription items state and list manipulation callbacks

import { useState, useCallback } from "react";
import { type PrescriptionItem, createDefaultPrescriptionItem } from "./prescription.types";

export const usePrescriptionItems = () => {
  const [items, setItems] = useState<PrescriptionItem[]>([
    createDefaultPrescriptionItem(),
  ]);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, createDefaultPrescriptionItem()]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof PrescriptionItem, value: string) => {
      setItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [],
  );

  return { items, addItem, removeItem, updateItem } as const;
};
