// Responsibility: Modal container for recording clinical encounters, diagnoses, and vitals

import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/ui/Form';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ModalFooter } from '@/components/common/ModalFooter';
import { EncounterVitalsSection } from './EncounterVitalsSection';
import { useEncounterForm } from './useEncounterForm';
import { type EncounterFormModalProps, encounterTypeOptions } from './encounter.types';

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
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={encounter ? 'Update Encounter' : 'Save Encounter'}
          isLoading={loading}
        />
      }
    >
      <Form onSubmit={handleSubmit}>
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
      </Form>
    </Modal>
  );
};

export default EncounterFormModal;
