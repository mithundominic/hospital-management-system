// Responsibility: Manage state, validation, and submission logic for prescription form

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import type { PrescriptionItem, PrescriptionEncounterOption } from './prescription.types';

export const usePrescriptionForm = (
  onClose: () => void,
  onSuccess: () => void,
  encounterId?: string,
  patientId?: string
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState(encounterId || '');
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medicine_name: '',
      dosage: '',
      frequency: '',
      duration_days: '',
      route: 'oral',
      instructions: '',
    },
  ]);

  const { data: encounters = [] } = useQuery<PrescriptionEncounterOption[]>({
    queryKey: ['encounters', currentHospital?.id, patientId],
    queryFn: async () => {
      if (!currentHospital || !patientId) return [];
      return await api.get<PrescriptionEncounterOption[]>(
        `/hospitals/${currentHospital.id}/encounters?patient_id=${patientId}`
      );
    },
    enabled: !!currentHospital && !!patientId && !encounterId,
  });

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { medicine_name: '', dosage: '', frequency: '', duration_days: '', route: 'oral', instructions: '' },
    ]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateItem = useCallback((index: number, field: keyof PrescriptionItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    if (!currentHospital) return;
    const targetEncounter = selectedEncounter || encounterId;
    if (!targetEncounter) {
      toast.error('Please select an encounter');
      return;
    }
    const validItems = items.filter((i) => i.medicine_name.trim() !== '');
    if (validItems.length === 0) {
      toast.error('Please add at least one medicine');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/hospitals/${currentHospital.id}/prescriptions`, {
        encounter_id: targetEncounter,
        items: validItems,
      });
      toast.success('Prescription created successfully');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create prescription';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [currentHospital, selectedEncounter, encounterId, items, onSuccess, onClose]);

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
