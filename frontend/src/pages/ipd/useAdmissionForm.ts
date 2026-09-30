// Responsibility: Manage patient admission form state and API submission

import { useState, useCallback, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import {
  createHospitalAdmission,
  updateHospitalAdmission,
} from "@/services/ipd.service";
import type { Admission } from "@/types";
import type { AdmissionFormData } from "./ipd.types";
import { useAdmissionOptions } from "./useAdmissionOptions";

export const useAdmissionForm = (
  onClose: () => void,
  onSuccess: () => void,
  admission?: Admission | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdmissionFormData>({
    patient_id: admission?.patient_id || "",
    bed_id: admission?.bed_id || "",
    doctor_id: admission?.doctor_id || "",
    admission_type: "emergency",
    admission_date: new Date().toISOString().slice(0, 16),
    diagnosis: admission?.admission_notes || "",
    instructions: "",
  });

  const { patients, beds, doctors } = useAdmissionOptions(
    currentHospital?.id,
    admission?.bed_id,
  );

  const updateField = useCallback(
    <K extends keyof AdmissionFormData>(key: K, val: AdmissionFormData[K]) => {
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
          ...formData,
          admission_date: new Date(formData.admission_date).toISOString(),
        };
        if (admission?.id) {
          await updateHospitalAdmission(
            currentHospital.id,
            admission.id,
            payload,
          );
          toast.success("Admission updated successfully");
        } else {
          await createHospitalAdmission(currentHospital.id, payload);
          toast.success("Patient admitted successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save admission";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, admission, onSuccess, onClose],
  );

  return {
    loading,
    formData,
    updateField,
    patients,
    beds,
    doctors,
    handleSubmit,
  } as const;
};
