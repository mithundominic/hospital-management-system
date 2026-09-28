// Responsibility: Modal container for recording clinical encounters, diagnoses, and vitals

import { Modal } from '@/components/ui/Modal';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { EncounterVitalsSection } from './EncounterVitalsSection';
import { useEncounterForm } from './useEncounterForm';
import type { EncounterFormModalProps } from './encounter.types';

const encounterTypeOptions = [
  { value: 'opd', label: 'OPD (Outpatient)' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'ipd', label: 'IPD (Inpatient)' },
];

export const EncounterFormModal = ({ onClose, onSuccess, encounter }: EncounterFormModalProps) => {
  const { loading, formData, updateField, patients, doctors, handleSubmit } =
    useEncounterForm(onClose, onSuccess, encounter);

  const patientOpts = [
    { value: '', label: 'Select Patient' },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  const doctorOpts = [
    { value: '', label: 'Select Doctor' },
    ...doctors.map((d) => ({ value: d.id, label: `Dr. (${d.specialization || 'General'})` })),
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={encounter ? 'Edit Encounter' : 'New Clinical Encounter'}
      maxWidth="2xl"
      footer={
        <Flex justify="end" gap={3}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={(e) => handleSubmit(e)} isLoading={loading}>
            {encounter ? 'Update Encounter' : 'Save Encounter'}
          </Button>
        </Flex>
      }
    >
      <form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Grid cols={3} gap={3}>
            <Select
              label="Patient *"
              value={formData.patient_id}
              onChange={(e) => updateField('patient_id', e.target.value)}
              options={patientOpts}
              required
            />
            <Select
              label="Doctor *"
              value={formData.doctor_id}
              onChange={(e) => updateField('doctor_id', e.target.value)}
              options={doctorOpts}
              required
            />
            <Select
              label="Encounter Type"
              value={formData.encounter_type}
              onChange={(e) => updateField('encounter_type', e.target.value as 'opd' | 'emergency' | 'ipd')}
              options={encounterTypeOptions}
            />
          </Grid>
          <Input
            label="Chief Complaint *"
            placeholder="e.g. High fever with cough"
            value={formData.chief_complaint}
            onChange={(e) => updateField('chief_complaint', e.target.value)}
            required
          />
          <Input
            label="Diagnosis"
            placeholder="Clinical diagnosis"
            value={formData.diagnosis}
            onChange={(e) => updateField('diagnosis', e.target.value)}
          />
          <EncounterVitalsSection formData={formData} onUpdate={updateField} />
          <Textarea
            label="Clinical Notes"
            rows={2}
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </Box>
      </form>
    </Modal>
  );
};

export default EncounterFormModal;
