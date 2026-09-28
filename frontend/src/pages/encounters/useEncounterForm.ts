// Responsibility: Manage clinical encounter form state, vitals calculation, and API submission

import { useState, useCallback, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import type { Encounter } from '@/types';
import type { EncounterFormData } from './encounter.types';

export const useEncounterForm = (
  onClose: () => void,
  onSuccess: () => void,
  encounter?: Encounter | null
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EncounterFormData>({
    patient_id: encounter?.patient_id || '',
    doctor_id: encounter?.doctor_id || '',
    encounter_type: encounter?.encounter_type || 'opd',
    chief_complaint: encounter?.chief_complaint || '',
    diagnosis: encounter?.diagnosis || '',
    notes: encounter?.notes || '',
    status: 'in-progress',
    temperature: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    pulse_rate: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    weight: '',
    height: '',
  });

  const { data: patients = [] } = useQuery<{ id: string; full_name: string }[]>({
    queryKey: ['patients', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<{ id: string; full_name: string }[]>(`/hospitals/${currentHospital.id}/patients`);
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
    <K extends keyof EncounterFormData>(key: K, val: EncounterFormData[K]) => {
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
        const vitals: Record<string, unknown> = {};
        if (formData.temperature) vitals.temperature = Number(formData.temperature);
        if (formData.blood_pressure_systolic && formData.blood_pressure_diastolic) {
          vitals.blood_pressure = {
            systolic: Number(formData.blood_pressure_systolic),
            diastolic: Number(formData.blood_pressure_diastolic),
          };
        }
        if (formData.pulse_rate) vitals.pulse_rate = Number(formData.pulse_rate);
        if (formData.oxygen_saturation) vitals.oxygen_saturation = Number(formData.oxygen_saturation);

        const payload = {
          patient_id: formData.patient_id,
          doctor_id: formData.doctor_id,
          encounter_type: formData.encounter_type,
          chief_complaint: formData.chief_complaint,
          diagnosis: formData.diagnosis,
          notes: formData.notes,
          vitals: Object.keys(vitals).length > 0 ? vitals : null,
        };

        if (encounter?.id) {
          await api.patch(`/hospitals/${currentHospital.id}/encounters/${encounter.id}`, payload);
          toast.success('Encounter updated successfully');
        } else {
          await api.post(`/hospitals/${currentHospital.id}/encounters`, payload);
          toast.success('Encounter created successfully');
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save encounter';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, encounter, onSuccess, onClose]
  );

  return { loading, formData, updateField, patients, doctors, handleSubmit } as const;
};
