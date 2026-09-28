// Responsibility: Modal container for scheduling shifts with timing presets and staff allocation

import { Modal } from '@/components/ui/Modal';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useShiftForm } from './useShiftForm';
import type { Shift } from '@/types';

export interface ShiftFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  shift?: Shift | null;
}

const shiftTypeOptions = [
  { value: 'morning', label: 'Morning (06:00 - 14:00)' },
  { value: 'afternoon', label: 'Afternoon (14:00 - 22:00)' },
  { value: 'night', label: 'Night (22:00 - 06:00)' },
];

export const ShiftFormModal = ({ onClose, onSuccess, shift }: ShiftFormModalProps) => {
  const { loading, formData, updateField, staffMembers, setPreset, handleSubmit } =
    useShiftForm(onClose, onSuccess, shift);

  const staffOpts = [
    { value: '', label: 'Select Staff Member' },
    ...staffMembers.map((s) => ({ value: s.id, label: `${s.user_email} (${s.role_name || 'Staff'})` })),
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={shift ? 'Edit Shift' : 'Schedule Staff Shift'}
      maxWidth="xl"
      footer={
        <Flex justify="end" gap={3}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={(e) => handleSubmit(e)} isLoading={loading}>
            {shift ? 'Update Shift' : 'Schedule Shift'}
          </Button>
        </Flex>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Select
            label="Staff Member *"
            value={formData.staff_id}
            onChange={(e) => updateField('staff_id', e.target.value)}
            options={staffOpts}
            required
          />

          <Box>
            <Text size="xs" variant="muted" className="mb-2">Quick Shift Presets:</Text>
            <Flex gap={2}>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreset('morning')}>
                Morning (6am-2pm)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreset('afternoon')}>
                Afternoon (2pm-10pm)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreset('night')}>
                Night (10pm-6am)
              </Button>
            </Flex>
          </Box>

          <Grid cols={3} gap={3}>
            <Input
              label="Shift Date *"
              type="date"
              value={formData.shift_date}
              onChange={(e) => updateField('shift_date', e.target.value)}
              required
            />
            <Input
              label="Start Time *"
              type="time"
              value={formData.shift_start.slice(11, 16)}
              onChange={(e) => updateField('shift_start', `${formData.shift_date}T${e.target.value}`)}
              required
            />
            <Input
              label="End Time *"
              type="time"
              value={formData.shift_end.slice(11, 16)}
              onChange={(e) => updateField('shift_end', `${formData.shift_date}T${e.target.value}`)}
              required
            />
          </Grid>

          <Select
            label="Shift Type"
            value={formData.shift_type}
            onChange={(e) => updateField('shift_type', e.target.value as 'morning' | 'afternoon' | 'night')}
            options={shiftTypeOptions}
          />
        </Box>
      </form>
    </Modal>
  );
};

export default ShiftFormModal;
