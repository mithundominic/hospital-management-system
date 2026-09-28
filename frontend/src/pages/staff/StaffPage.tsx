// Responsibility: Main staff management page listing active hospital members and modal invitation

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { useHospital } from '@/contexts/HospitalContext';
import { api } from '@/lib/api';
import { Box } from '@/components/ui/Box';
import { Grid } from '@/components/ui/Grid';
import { Flex } from '@/components/ui/Flex';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { StaffMemberCard, type Membership } from './StaffMemberCard';
import { StaffInviteFormModal } from './StaffInviteFormModal';

export const StaffPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const { data: memberships = [], isLoading, refetch } = useQuery<Membership[]>({
    queryKey: ['memberships', currentHospital?.id],
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Membership[]>(`/hospitals/${currentHospital.id}/memberships`);
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <Flex align="center" justify="between">
        <Box>
          <Heading level={1} className="text-2xl font-bold text-gray-900">
            Staff Management
          </Heading>
          <Text variant="muted">Manage hospital staff memberships and role allocations</Text>
        </Box>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="h-5 w-5" />}>
          Invite Staff
        </Button>
      </Flex>

      {isLoading ? (
        <Grid cols={3} gap={4}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </Grid>
      ) : memberships.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={Users}
            title="No staff members found"
            description="Invite colleagues, doctors, nurses, and staff to join this hospital."
            actionLabel="Invite Staff"
            onAction={() => setShowModal(true)}
          />
        </Card>
      ) : (
        <Grid cols={3} gap={4}>
          {memberships.map((member) => (
            <StaffMemberCard key={member.id} member={member} />
          ))}
        </Grid>
      )}

      {showModal && (
        <StaffInviteFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default StaffPage;
