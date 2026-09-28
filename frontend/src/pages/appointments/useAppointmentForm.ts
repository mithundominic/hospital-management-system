// Responsibility: Manage state, options queries, and submission for appointment booking

import { useState, useCallback, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import type { Appointment } from '@/types';
import type { AppointmentFormData, PatientOption, DoctorOption } from './appointment.types';

export const useAppointmentForm = (
  onClose: () => void,
  onSuccess: () => void,
  appointment?: Appointment | null
) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: appointment?.patient_id || '',
    doctor_membership_id: '',
    department_id: '',
    scheduled_at: appointment?.scheduled_at
      ? new Date(appointment.scheduled_at).toISOString().slice(0, 16)
      : '',
    duration_minutes: appointment?.duration_minutes || 30,
    reason: appointment?.reason || '',
    status: appointment?.status || 'scheduled',
  });

  const { data: patients = [] } = useQuery<PatientOption[]>({
    queryKey: ['patients', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<PatientOption[]>(`/hospitals/${currentHospital.id}/patients`);
    },
    enabled: !!currentHospital,
  });

  const { data: doctors = [] } = useQuery<DoctorOption[]>({
    queryKey: ['doctors', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<DoctorOption[]>(`/hospitals/${currentHospital.id}/doctors`);
    },
    enabled: !!currentHospital,
  });

  const updateField = useCallback(
    <K extends keyof AppointmentFormData>(key: K, val: AppointmentFormData[K]) => {
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
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
          duration_minutes: Number(formData.duration_minutes),
        };
        if (appointment?.id) {
          await api.patch(`/hospitals/${currentHospital.id}/appointments/${appointment.id}`, payload);
          toast.success('Appointment updated successfully');
        } else {
          await api.post(`/hospitals/${currentHospital.id}/appointments`, payload);
          toast.success('Appointment booked successfully');
        }
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save appointment';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, formData, appointment, onSuccess, onClose]
  );

  return { loading, formData, updateField, patients, doctors, handleSubmit } as const;
};
