// Responsibility: Render patient demographics summary header card

import { UserCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { calculateAge } from './patient.utils';
import type { Patient } from '@/types';

export interface PatientDetailHeaderProps {
  patient: Patient;
}

export const PatientDetailHeader = ({ patient }: PatientDetailHeaderProps) => {
  const mrn = patient.patient_registrations?.[0]?.hospital_patient_number || 'N/A';
  const age = calculateAge(patient.dob);

  return (
    <Card className="p-6">
      <Flex align="start" gap={6}>
        <UserCircle className="h-20 w-20 text-gray-400 shrink-0" />
        <Box className="flex-1">
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            {patient.full_name}
          </Heading>
          <Grid cols={4} gap={4} className="mt-4">
            <Box>
              <Text size="xs" variant="muted">MRN</Text>
              <Text weight="medium" className="font-mono">{mrn}</Text>
            </Box>
            <Box>
              <Text size="xs" variant="muted">Age / Gender</Text>
              <Text weight="medium">{age} yrs / {patient.gender}</Text>
            </Box>
            <Box>
              <Text size="xs" variant="muted">Blood Group</Text>
              <Text weight="medium">{patient.blood_group || 'Unknown'}</Text>
            </Box>
            <Box>
              <Text size="xs" variant="muted">Phone</Text>
              <Text weight="medium">{patient.phone || 'N/A'}</Text>
            </Box>
          </Grid>
        </Box>
      </Flex>
    </Card>
  );
};
