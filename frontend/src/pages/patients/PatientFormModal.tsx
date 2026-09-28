// Responsibility: Modal container for registering and updating patient demographics and MRN

import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/ui/Form';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ModalFooter } from '@/components/common/ModalFooter';
import { usePatientForm } from './usePatientForm';
import { genderOptions, bloodOptions } from './patient.data';
import type { Patient } from '@/types';

export interface PatientFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  patient?: (Patient & { hospital_patient_number?: string }) | null;
}

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
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? 'Update Patient' : 'Register Patient'}
          isLoading={loading}
        />
      }
    >
      <Form onSubmit={handleSubmit}>
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
      </Form>
    </Modal>
  );
};

export default PatientFormModal;
