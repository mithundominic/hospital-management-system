// Responsibility: Modal dialog for booking and updating patient appointments

import { Modal } from '@/components/ui/Modal';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAppointmentForm } from './useAppointmentForm';
import type { AppointmentFormModalProps } from './appointment.types';

export const AppointmentFormModal = ({
  onClose,
  onSuccess,
  appointment,
}: AppointmentFormModalProps) => {
  const { loading, formData, updateField, patients, doctors, handleSubmit } =
    useAppointmentForm(onClose, onSuccess, appointment);

  const patientOpts = [
    { value: '', label: 'Select Patient' },
    ...patients.map((p) => ({ value: p.id, label: `${p.full_name} (${p.phone || 'N/A'})` })),
  ];

  const doctorOpts = [
    { value: '', label: 'Select Doctor' },
    ...doctors.map((d) => ({
      value: d.membership_id || d.id,
      label: `Dr. ${d.specialization || 'Physician'} (${d.user?.email || 'Staff'})`,
    })),
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={appointment ? 'Edit Appointment' : 'Book New Appointment'}
      maxWidth="xl"
      footer={
        <Flex justify="end" gap={3}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={(e) => handleSubmit(e)} isLoading={loading}>
            {appointment ? 'Update' : 'Book'}
          </Button>
        </Flex>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Select
            label="Patient *"
            value={formData.patient_id}
            onChange={(e) => updateField('patient_id', e.target.value)}
            options={patientOpts}
            required
          />
          <Select
            label="Doctor *"
            value={formData.doctor_membership_id}
            onChange={(e) => updateField('doctor_membership_id', e.target.value)}
            options={doctorOpts}
            required
          />
          <Grid cols={2} gap={4}>
            <Input
              label="Date & Time *"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => updateField('scheduled_at', e.target.value)}
              required
            />
            <Input
              label="Duration (minutes) *"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => updateField('duration_minutes', Number(e.target.value))}
              required
            />
          </Grid>
          <Input
            label="Reason for Visit"
            value={formData.reason}
            onChange={(e) => updateField('reason', e.target.value)}
            placeholder="Chief complaint or reason"
          />
        </Box>
      </form>
    </Modal>
  );
};

export default AppointmentFormModal;
