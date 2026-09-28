// Responsibility: Manage staff shift scheduling form state, timing presets, and API submission

import { useState, useCallback, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import type { Shift } from '@/types';

export interface ShiftFormData {
  staff_id: string;
  shift_date: string;
  shift_start: string;
  shift_end: string;
  shift_type: 'morning' | 'afternoon' | 'night';
}

export const useShiftForm = (
  onClose: () => void,
  onSuccess: () => void,
  shift?: Shift | null
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShiftFormData>({
    staff_id: shift?.user_id || '',
    shift_date: shift?.shift_date || new Date().toISOString().slice(0, 10),
    shift_start: shift?.start_time ? `${shift.shift_date}T${shift.start_time}` : '',
    shift_end: shift?.end_time ? `${shift.shift_date}T${shift.end_time}` : '',
    shift_type: shift?.shift_type || 'morning',
  });

  const { data: staffMembers = [] } = useQuery<{ id: string; user_email?: string; role_name?: string }[]>({
    queryKey: ['memberships', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<{ id: string; user_email?: string; role_name?: string }[]>(
        `/hospitals/${currentHospital.id}/memberships`
      );
    },
    enabled: !!currentHospital,
  });

  const updateField = useCallback(
    <K extends keyof ShiftFormData>(key: K, val: ShiftFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const setPreset = useCallback((type: 'morning' | 'afternoon' | 'night') => {
    setFormData((prev) => {
      const date = prev.shift_date || new Date().toISOString().slice(0, 10);
      const times = {
        morning: { start: `${date}T06:00`, end: `${date}T14:00` },
        afternoon: { start: `${date}T14:00`, end: `${date}T22:00` },
        night: { start: `${date}T22:00`, end: `${date}T06:00` },
      }[type];
      return { ...prev, shift_type: type, shift_start: times.start, shift_end: times.end };
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!currentHospital) return;
      setLoading(true);
      try {
        const payload = {
          user_id: formData.staff_id,
          shift_date: formData.shift_date,
          shift_type: formData.shift_type,
          start_time: formData.shift_start.slice(11, 16),
          end_time: formData.shift_end.slice(11, 16),
        };
        if (shift?.id) {
          await api.patch(`/hospitals/${currentHospital.id}/shifts/${shift.id}`, payload);
          toast.success('Shift updated successfully');
        } else {
          await api.post(`/hospitals/${currentHospital.id}/shifts`, payload);
          toast.success('Shift scheduled successfully');
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save shift';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, shift, onSuccess, onClose]
  );

  return { loading, formData, updateField, staffMembers, setPreset, handleSubmit } as const;
};
