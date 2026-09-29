// Responsibility: Manage clinical encounter form state, vitals calculation, and API submission

import { useState, useCallback, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import {
  createHospitalEncounter,
  updateHospitalEncounter,
} from "@/services/encounter.service";
import type { Encounter } from "@/types";
import type { EncounterFormData } from "./encounter.types";
import {
  getInitialEncounterFormData,
  formatEncounterVitals,
} from "./encounter.utils";
import { useEncounterOptions } from "./useEncounterOptions";

export const useEncounterForm = (
  onClose: () => void,
  onSuccess: () => void,
  encounter?: Encounter | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EncounterFormData>(() =>
    getInitialEncounterFormData(encounter),
  );

  const { patients, doctors } = useEncounterOptions(currentHospital?.id);

  const updateField = useCallback(
    <K extends keyof EncounterFormData>(key: K, val: EncounterFormData[K]) => {
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
        const payload = {
          patient_id: formData.patient_id,
          doctor_id: formData.doctor_id,
          encounter_type: formData.encounter_type,
          chief_complaint: formData.chief_complaint,
          diagnosis: formData.diagnosis,
          notes: formData.notes,
          vitals: formatEncounterVitals(formData),
        };

        if (encounter?.id) {
          await updateHospitalEncounter(
            currentHospital.id,
            encounter.id,
            payload,
          );
          toast.success("Encounter updated successfully");
        } else {
          await createHospitalEncounter(currentHospital.id, payload);
          toast.success("Encounter created successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save encounter";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, encounter, onSuccess, onClose],
  );

  return {
    loading,
    formData,
    updateField,
    patients,
    doctors,
    handleSubmit,
  } as const;
};
