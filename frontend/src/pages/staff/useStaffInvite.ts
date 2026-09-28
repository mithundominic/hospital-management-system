// Responsibility: Manage staff invitation form state and API submission

import { useState, useCallback, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';

export const useStaffInvite = (onClose: () => void, onSuccess: () => void) => {
  const { currentHospital } = useHospital();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('Doctor');

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!currentHospital) return;
      if (!email.trim()) {
        toast.error('Please enter a staff email');
        return;
      }

      setLoading(true);
      try {
        await api.post(`/hospitals/${currentHospital.id}/memberships`, {
          email,
          role_name: roleName,
          status: 'invited',
        });
        toast.success('Staff invitation sent successfully');
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send invitation';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [currentHospital, email, roleName, onSuccess, onClose]
  );

  return { loading, email, setEmail, roleName, setRoleName, handleSubmit } as const;
};
