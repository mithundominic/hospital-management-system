// Responsibility: Manage patient admission form state, available beds query, and API submission

import { useState, useCallback, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES, BED_STATUS } from "@/constants";
import type { Admission, Bed } from "@/types";
import type { AdmissionFormData } from "./ipd.types";

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

  const { data: patients = [] } = useQuery<{ id: string; full_name: string }[]>({
    queryKey: QUERY_KEYS.hospitals.patients(currentHospital?.id),
    queryFn: () =>
      currentHospital
        ? api.get<{ id: string; full_name: string }[]>(API_ROUTES.hospitals.patients(currentHospital.id))
        : [],
    enabled: !!currentHospital,
  });

  const { data: beds = [] } = useQuery<Bed[]>({
    queryKey: QUERY_KEYS.hospitals.beds(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      const allBeds = await api.get<Bed[]>(API_ROUTES.hospitals.beds(currentHospital.id));
      return allBeds.filter((b) => b.status === BED_STATUS.AVAILABLE || b.id === admission?.bed_id);
    },
    enabled: !!currentHospital,
  });

  const { data: doctors = [] } = useQuery<{ id: string; specialization?: string }[]>({
    queryKey: QUERY_KEYS.hospitals.doctors(currentHospital?.id),
    queryFn: () =>
      currentHospital
        ? api.get<{ id: string; specialization?: string }[]>(API_ROUTES.hospitals.doctors(currentHospital.id))
        : [],
    enabled: !!currentHospital,
  });

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
          await api.patch(API_ROUTES.hospitals.admission(currentHospital.id, admission.id), payload);
          toast.success("Admission updated successfully");
        } else {
          await api.post(API_ROUTES.hospitals.admissions(currentHospital.id), payload);
          toast.success("Patient admitted successfully");
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to save admission";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, admission, onSuccess, onClose],
  );

  return { loading, formData, updateField, patients, beds, doctors, handleSubmit } as const;
};
