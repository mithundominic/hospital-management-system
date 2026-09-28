// Responsibility: Manage patient admission form state, available beds query, and API submission

import { useState, useCallback, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import type { Admission, Bed } from '@/types';

export interface AdmissionFormData {
  patient_id: string;
  bed_id: string;
  doctor_id: string;
  admission_type: string;
  admission_date: string;
  diagnosis: string;
  instructions: string;
}

export const useAdmissionForm = (
  onClose: () => void,
  onSuccess: () => void,
  admission?: Admission | null
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdmissionFormData>({
    patient_id: admission?.patient_id || '',
    bed_id: admission?.bed_id || '',
    doctor_id: admission?.doctor_id || '',
    admission_type: 'emergency',
    admission_date: new Date().toISOString().slice(0, 16),
    diagnosis: admission?.admission_notes || '',
    instructions: '',
  });

  const { data: patients = [] } = useQuery<{ id: string; full_name: string }[]>({
    queryKey: ['patients', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<{ id: string; full_name: string }[]>(`/hospitals/${currentHospital.id}/patients`);
    },
    enabled: !!currentHospital,
  });

  const { data: beds = [] } = useQuery<Bed[]>({
    queryKey: ['beds', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      const allBeds = await api.get<Bed[]>(`/hospitals/${currentHospital.id}/beds`);
      return allBeds.filter((b) => b.status === 'available' || b.id === admission?.bed_id);
    },
    enabled: !!currentHospital,
  });

  const { data: doctors = [] } = useQuery<{ id: string; specialization?: string }[]>({
    queryKey: ['doctors', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<{ id: string; specialization?: string }[]>(`/hospitals/${currentHospital.id}/doctors`);
    },
    enabled: !!currentHospital,
  });

  const updateField = useCallback(
    <K extends keyof AdmissionFormData>(key: K, val: AdmissionFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        const payload = {
          ...formData,
          admission_date: new Date(formData.admission_date).toISOString(),
        };
        if (admission?.id) {
          await api.patch(`/hospitals/${currentHospital.id}/admissions/${admission.id}`, payload);
          toast.success('Admission updated successfully');
        } else {
          await api.post(`/hospitals/${currentHospital.id}/admissions`, payload);
          toast.success('Patient admitted successfully');
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save admission';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, admission, onSuccess, onClose]
  );

  return { loading, formData, updateField, patients, beds, doctors, handleSubmit } as const;
};
