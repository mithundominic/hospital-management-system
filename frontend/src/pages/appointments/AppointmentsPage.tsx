// Responsibility: Main appointments management page with date selection and booking modal

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AppointmentFormModal } from './AppointmentFormModal';
import { AppointmentsTimeline } from './AppointmentsTimeline';
import type { Appointment } from '@/types';

export const AppointmentsPage = () => {
  const { currentHospital } = useHospital();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showModal, setShowModal] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading, refetch } = useQuery<Appointment[]>({
    queryKey: ['appointments', currentHospital?.id, selectedDate],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Appointment[]>(
        `/hospitals/${currentHospital.id}/appointments?date=${selectedDate}`
      );
    },
    enabled: !!currentHospital,
  });

  const handleConfirmCancel = async () => {
    if (!cancellingApt || !currentHospital) return;
    try {
      await api.patch(`/hospitals/${currentHospital.id}/appointments/${cancellingApt.id}`, {
        status: 'cancelled',
      });
      toast.success('Appointment cancelled successfully');
      refetch();
    } catch {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancellingApt(null);
    }
  };

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">Appointments</Heading>
          <Text variant="muted">Manage patient appointments and scheduling</Text>
        </Box>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-5 w-5" />}>
          New Appointment
        </Button>
      </Flex>

      <Card className="p-4">
        <Flex align="center" gap={4}>
          <Calendar className="h-5 w-5 text-gray-400" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="max-w-xs"
          />
          <Text size="sm" variant="muted">{appointments.length} appointments scheduled</Text>
        </Flex>
      </Card>

      <AppointmentsTimeline
        isLoading={isLoading}
        appointments={appointments}
        onEdit={(apt) => { setEditingApt(apt); setShowModal(true); }}
        onCancel={(apt) => setCancellingApt(apt)}
        onNew={() => setShowModal(true)}
      />

      {showModal && (
        <AppointmentFormModal
          appointment={editingApt}
          onClose={() => { setShowModal(false); setEditingApt(null); }}
          onSuccess={() => refetch()}
        />
      )}

      <ConfirmDialog
        isOpen={!!cancellingApt}
        onClose={() => setCancellingApt(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
      />
    </Box>
  );
};

export default AppointmentsPage;
