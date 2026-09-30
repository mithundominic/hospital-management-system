// Responsibility: Leave management page with applications list and approval workflow
 
"use client";

import { Calendar, Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Card, CardContent } from "@/components/ui/Card";
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
      <Flex align="center" justify="between">
        <Heading level={1}>Leave Management</Heading>
        <Button onClick={openModal}>
          <Plus className="h-4 w-4 mr-2" />
          Apply for Leave
        </Button>
      </Flex>

      <Card>
        <CardContent className="p-6">
          <Heading level={2} className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5" />
            Leave Applications
          </Heading>
          <LeaveTable
            applications={leaveApplications}
            canApprove={canApprove}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </CardContent>
      </Card>

      <LeaveFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={closeModal}
      />
    </Box>
  );
};

export default LeavePage;
