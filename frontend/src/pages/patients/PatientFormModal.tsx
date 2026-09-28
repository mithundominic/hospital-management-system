// Responsibility: Modal container for registering and updating patient demographics and MRN

import { Modal } from '@/components/ui/Modal';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { usePatientForm } from './usePatientForm';
import type { Patient } from '@/types';

export interface PatientFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  patient?: (Patient & { hospital_patient_number?: string }) | null;
}

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const bloodOptions = [
  { value: '', label: 'Select...' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const PatientFormModal = ({ onClose, onSuccess, patient }: PatientFormModalProps) => {
  const { loading, isEditMode, formData, updateField, handleSubmit } =
    usePatientForm(onClose, onSuccess, patient);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditMode ? 'Edit Patient' : 'Register New Patient'}
      maxWidth="2xl"
      footer={
        <Flex justify="end" gap={3}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={(e) => handleSubmit(e)} isLoading={loading}>
            {isEditMode ? 'Update Patient' : 'Register Patient'}
          </Button>
        </Flex>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Input
            label="Full Name *"
            required
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
          />
          <Grid cols={2} gap={4}>
            <Input
              label="Date of Birth *"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => updateField('dob', e.target.value)}
            />
            <Select
              label="Gender *"
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              options={genderOptions}
            />
            <Input
              label="Phone Number *"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <Select
              label="Blood Group"
              value={formData.blood_group}
              onChange={(e) => updateField('blood_group', e.target.value)}
              options={bloodOptions}
            />
            <Input
              label="Hospital MRN *"
              required={!isEditMode}
              disabled={isEditMode}
              value={formData.hospital_patient_number}
              onChange={(e) => updateField('hospital_patient_number', e.target.value)}
              helperText={isEditMode ? 'MRN cannot be changed after registration' : undefined}
            />
          </Grid>
        </Box>
      </form>
    </Modal>
  );
};

export default PatientFormModal;
