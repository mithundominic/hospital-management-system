// Responsibility: Main staff management page listing active hospital members and modal invitation

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { StaffMemberCard, type Membership } from "./StaffMemberCard";
import { StaffInviteFormModal } from "./StaffInviteFormModal";

export const StaffPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: memberships = [],
    isLoading,
    refetch,
  } = useQuery<Membership[]>({
    queryKey: QUERY_KEYS.hospitals.memberships(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Membership[]>(
        API_ROUTES.hospitals.memberships(currentHospital.id),
      );
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage hospital staff memberships and role allocations"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Invite Staff
          </Button>
        }
      />

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
