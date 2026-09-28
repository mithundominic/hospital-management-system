// Responsibility: Manage lab order form state, encounter selection, and submission logic

import { useState, useCallback, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import type { LabOrder } from '@/types';

export interface LabOrderFormData {
  encounter_id: string;
  test_name: string;
  sample_type: string;
  priority: 'routine' | 'urgent' | 'stat';
  instructions: string;
}

export const useLabOrderForm = (
  onClose: () => void,
  onSuccess: () => void,
  labOrder?: LabOrder | null
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LabOrderFormData>({
    encounter_id: labOrder?.encounter_id || '',
    test_name: labOrder?.test_name || '',
    sample_type: 'blood',
    priority: labOrder?.priority || 'routine',
    instructions: '',
  });

  const { data: encounters = [] } = useQuery<{ id: string; chief_complaint?: string }[]>({
    queryKey: ['encounters', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<{ id: string; chief_complaint?: string }[]>(
        `/hospitals/${currentHospital.id}/encounters`
      );
    },
    enabled: !!currentHospital,
  });

  const updateField = useCallback(
    <K extends keyof LabOrderFormData>(key: K, val: LabOrderFormData[K]) => {
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
        if (labOrder?.id) {
          await api.patch(`/hospitals/${currentHospital.id}/lab-orders/${labOrder.id}`, formData);
          toast.success('Lab order updated successfully');
        } else {
          await api.post(`/hospitals/${currentHospital.id}/lab-orders`, formData);
          toast.success('Lab order created successfully');
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save lab order';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, labOrder, onSuccess, onClose]
  );

  return { loading, formData, updateField, encounters, handleSubmit } as const;
};
