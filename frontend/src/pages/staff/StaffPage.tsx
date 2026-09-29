// Responsibility: Main staff management page listing active hospital members and modal invitation

import { Plus, Users } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { StaffMemberCard } from "./StaffMemberCard";
import { StaffInviteFormModal } from "./StaffInviteFormModal";
import { useStaffPage } from "./useStaffPage";

export const StaffPage = () => {
  const { memberships, isLoading, showModal, openModal, closeModal, refetch } =
    useStaffPage();

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage hospital staff memberships and role allocations"
        action={
          <Button onClick={openModal} icon={<Plus className="h-5 w-5" />}>
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
            onAction={openModal}
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
          onClose={closeModal}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default StaffPage;
