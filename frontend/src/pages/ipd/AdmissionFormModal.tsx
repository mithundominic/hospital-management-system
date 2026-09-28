// Responsibility: Modal container for IPD patient admission and bed allocation

import { Modal } from '@/components/ui/Modal';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useAdmissionForm } from './useAdmissionForm';
import type { Admission } from '@/types';

export interface AdmissionFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  admission?: Admission | null;
}

const admissionTypeOptions = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'planned', label: 'Planned / Elective' },
  { value: 'transfer', label: 'Transfer' },
];

export const AdmissionFormModal = ({ onClose, onSuccess, admission }: AdmissionFormModalProps) => {
  const { loading, formData, updateField, patients, beds, doctors, handleSubmit } =
    useAdmissionForm(onClose, onSuccess, admission);

  const patientOpts = [
    { value: '', label: 'Select Patient' },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  const bedOpts = [
    { value: '', label: 'Select Available Bed' },
    ...beds.map((b) => ({ value: b.id, label: `${b.ward_name} - Bed ${b.bed_number} (${b.bed_type})` })),
  ];

  const doctorOpts = [
    { value: '', label: 'Select Admitting Doctor' },
    ...doctors.map((d) => ({ value: d.id, label: `Dr. (${d.specialization || 'General'})` })),
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={admission ? 'Update Admission' : 'Admit Patient'}
      maxWidth="2xl"
      footer={
        <Flex justify="end" gap={3}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={(e) => handleSubmit(e)} isLoading={loading}>
            {admission ? 'Update Admission' : 'Admit Patient'}
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
          <Grid cols={2} gap={4}>
            <Select
              label="Allocated Bed *"
              value={formData.bed_id}
              onChange={(e) => updateField('bed_id', e.target.value)}
              options={bedOpts}
              required
            />
            <Select
              label="Admitting Doctor *"
              value={formData.doctor_id}
              onChange={(e) => updateField('doctor_id', e.target.value)}
              options={doctorOpts}
              required
            />
            <Select
              label="Admission Type"
              value={formData.admission_type}
              onChange={(e) => updateField('admission_type', e.target.value)}
              options={admissionTypeOptions}
            />
            <Input
              label="Admission Date & Time *"
              type="datetime-local"
              value={formData.admission_date}
              onChange={(e) => updateField('admission_date', e.target.value)}
              required
            />
          </Grid>
          <Input
            label="Provisional Diagnosis *"
            placeholder="Primary reason for inpatient admission"
            value={formData.diagnosis}
            onChange={(e) => updateField('diagnosis', e.target.value)}
            required
          />
          <Textarea
            label="Admission Notes & Instructions"
            placeholder="Care protocol or special requirements"
            value={formData.instructions}
            onChange={(e) => updateField('instructions', e.target.value)}
          />
        </Box>
      </form>
    </Modal>
  );
};

export default AdmissionFormModal;
