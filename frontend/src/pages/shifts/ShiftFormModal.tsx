// Responsibility: Modal container for scheduling shifts with timing presets and staff allocation

import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/ui/Form';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ModalFooter } from '@/components/common/ModalFooter';
import { useShiftForm } from './useShiftForm';
import { type ShiftFormModalProps, shiftTypeOptions, shiftPresets } from './shift.types';

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
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={shift ? 'Update Shift' : 'Schedule Shift'}
          isLoading={loading}
        />
      }
    >
      <Form onSubmit={handleSubmit}>
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
              {shiftPresets.map((p) => (
                <Button key={p.type} type="button" variant="outline" size="sm" onClick={() => setPreset(p.type)}>
                  {p.label}
                </Button>
              ))}
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
      </Form>
    </Modal>
  );
};

export default ShiftFormModal;
