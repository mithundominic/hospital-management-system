// Responsibility: Main patients management page with search, table view, and registration modal

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import { PatientTable } from './PatientTable';
import { PatientFormModal } from './PatientFormModal';
import type { Patient } from '@/types';

interface PatientRecordItem {
  patients: Patient;
  hospital_patient_number: string;
}

export const PatientsPage = () => {
  const navigate = useNavigate();
  const { currentHospital } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const { data: rawPatients = [], isLoading, refetch } = useQuery<PatientRecordItem[]>({
    queryKey: ['patients', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<PatientRecordItem[]>(`/hospitals/${currentHospital.id}/patients`);
    },
    enabled: !!currentHospital,
  });

  const patients = rawPatients.map((item) => ({
    ...item.patients,
    hospital_patient_number: item.hospital_patient_number,
  }));

  const filtered = patients.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hospital_patient_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
  );

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">Patients</Heading>
          <Text variant="muted">Manage patient records and registrations</Text>
        </Box>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-5 w-5" />}>
          Register Patient
        </Button>
      </Flex>

      <Card className="p-4">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Search by name, MRN, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {isLoading ? (
        <Card className="p-4">
          <SkeletonTable rows={8} columns={6} />
        </Card>
      ) : (
        <PatientTable
          patients={filtered}
          onEdit={(p) => { setEditingPatient(p); setShowModal(true); }}
          onSelect={(id) => navigate(`/patients/${id}`)}
          onRegister={() => setShowModal(true)}
        />
      )}

      {showModal && (
        <PatientFormModal
          patient={editingPatient}
          onClose={() => { setShowModal(false); setEditingPatient(null); }}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default PatientsPage;
