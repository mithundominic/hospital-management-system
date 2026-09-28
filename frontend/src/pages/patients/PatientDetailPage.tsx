// Responsibility: Detailed profile page for single patient showing demographics and clinical history

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, TestTube, Pill } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PatientDetailHeader } from './PatientDetailHeader';
import type { Patient } from '@/types';

export const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentHospital } = useHospital();

  const { data: patient, isLoading } = useQuery<Patient | null>({
    queryKey: ['patient', currentHospital?.id, id],
    queryFn: async () => {
      if (!currentHospital || !id) return null;
      return await api.get<Patient>(`/hospitals/${currentHospital.id}/patients/${id}`);
    },
    enabled: !!currentHospital && !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!patient) {
    return (
      <Box className="text-center py-12">
        <Text variant="muted">Patient not found</Text>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <PatientDetailHeader patient={patient} />

      <Grid cols={3} gap={6}>
        <Box className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Flex align="center" gap={2} className="mb-4">
              <FileText className="h-5 w-5 text-primary-600" />
              <Heading level={3} className="text-lg font-semibold text-gray-900">Recent Encounters</Heading>
            </Flex>
            <Text size="sm" variant="muted">No encounters recorded yet</Text>
          </Card>

          <Card className="p-6">
            <Flex align="center" gap={2} className="mb-4">
              <TestTube className="h-5 w-5 text-primary-600" />
              <Heading level={3} className="text-lg font-semibold text-gray-900">Lab Results</Heading>
            </Flex>
            <Text size="sm" variant="muted">No lab results available</Text>
          </Card>
        </Box>

        <Box className="space-y-6">
          <Card className="p-6">
            <Heading level={3} className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Heading>
            <Box className="space-y-2">
              <Button className="w-full">Book Appointment</Button>
              <Button variant="secondary" className="w-full">Create Encounter</Button>
              <Button variant="secondary" className="w-full">View Billing</Button>
            </Box>
          </Card>

          <Card className="p-6">
            <Flex align="center" gap={2} className="mb-4">
              <Pill className="h-5 w-5 text-primary-600" />
              <Heading level={3} className="text-lg font-semibold text-gray-900">Prescriptions</Heading>
            </Flex>
            <Text size="sm" variant="muted">No active prescriptions</Text>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default PatientDetailPage;
