// Responsibility: Leave management page with applications list and approval workflow
 
"use client";

import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { LeaveTable } from "./LeaveTable";
import { LeaveFormModal } from "./LeaveFormModal";
import { useLeavePage } from "./useLeavePage";

export const LeavePage = () => {
  const {
    leaveApplications,
    isLoading,
    canApprove,
    isModalOpen,
    openModal,
    closeModal,
    handleApprove,
    handleReject,
  } = useLeavePage();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Track employee leave applications and approval workflows"
        action={
          <Button onClick={openModal} icon={<Plus className="h-4 w-4" />}>
            Apply for Leave
          </Button>
        }
      />

      <LeaveTable
        applications={leaveApplications}
        canApprove={canApprove}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <LeaveFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={closeModal}
      />
    </Box>
  );
};

export default LeavePage;
