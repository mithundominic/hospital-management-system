// Responsibility: Manage state, validation, and submission logic for prescription form

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import {
  getHospitalEncounters,
  createHospitalPrescription,
} from "@/services/encounter.service";
import { QUERY_KEYS } from "@/constants";
import type { PrescriptionEncounterOption } from "./prescription.types";
import { usePrescriptionItems } from "./usePrescriptionItems";

export const usePrescriptionForm = (
  onClose: () => void,
  onSuccess: () => void,
  encounterId?: string,
  patientId?: string,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState(encounterId || "");
  const { items, addItem, removeItem, updateItem } = usePrescriptionItems();

  const { data: encounters = [] } = useQuery<PrescriptionEncounterOption[]>({
    queryKey: QUERY_KEYS.hospitals.encounters(currentHospital?.id, patientId),
    queryFn: async () => {
      if (!currentHospital || !patientId) return [];
      const data = await getHospitalEncounters(currentHospital.id, patientId);
      return data.map((e) => ({
        id: e.id,
        encounter_type: e.encounter_type,
        started_at: e.created_at,
      }));
    },
    enabled: !!currentHospital && !!patientId && !encounterId,
  });

  const submit = useCallback(async () => {
    if (!currentHospital) return;
    const targetEncounter = selectedEncounter || encounterId;
    if (!targetEncounter) {
      toast.error("Please select an encounter");
      return;
    }
    const validItems = items.filter((i) => i.medicine_name.trim() !== "");
    if (validItems.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }
    setLoading(true);
    try {
      await createHospitalPrescription(currentHospital.id, {
        encounter_id: targetEncounter,
        items: validItems,
      });
      toast.success("Prescription created successfully");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create prescription";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [
    currentHospital,
    selectedEncounter,
    encounterId,
    items,
    onSuccess,
    onClose,
  ]);

  return {
    loading,
    selectedEncounter,
    setSelectedEncounter,
    items,
    encounters,
    addItem,
    removeItem,
    updateItem,
    submit,
  } as const;
};
