// Responsibility: Manage patient registration and update form state and API submission

import { useState, useCallback, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/useHospital";
import {
  createHospitalPatient,
  updateHospitalPatient,
} from "@/services/patient.service";
import type { Patient } from "@/types";

export interface PatientFormData {
  full_name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  blood_group: string;
  hospital_patient_number: string;
}

export const usePatientForm = (
  onClose: () => void,
  onSuccess: () => void,
  patient?: (Patient & { hospital_patient_number?: string }) | null,
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!patient;

  const [formData, setFormData] = useState<PatientFormData>({
    full_name: patient?.full_name || "",
    dob: patient?.dob || "",
    gender: patient?.gender || "Male",
    phone: patient?.phone || "",
    email: patient?.email || "",
    blood_group: patient?.blood_group || "",
    hospital_patient_number: patient?.hospital_patient_number || "",
  });

  const updateField = useCallback(
    <K extends keyof PatientFormData>(key: K, value: PatientFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        if (isEditMode && patient?.id) {
          const { hospital_patient_number, ...updateData } = formData;
          await updateHospitalPatient(
            currentHospital.id,
            patient.id,
            updateData,
          );
          toast.success("Patient updated successfully");
        } else {
          await createHospitalPatient(currentHospital.id, formData);
          toast.success("Patient registered successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save patient";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, isEditMode, patient, formData, onSuccess, onClose],
  );

  return { loading, isEditMode, formData, updateField, handleSubmit } as const;
};
