// Responsibility: Main lab orders management page displaying summary metrics and test orders table

import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { LabOrdersStatCards } from "./LabOrdersStatCards";
import { LabOrdersTable } from "./LabOrdersTable";
import { LabOrderFormModal } from "./LabOrderFormModal";
import { useLabOrdersPage } from "./useLabOrdersPage";

export const LabOrdersPage = () => {
  const { labOrders, isLoading, showModal, openModal, closeModal, refetch } =
    useLabOrdersPage();

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Lab Orders"
        description="Manage laboratory test orders and results"
        action={
          <Button onClick={openModal} icon={<Plus className="h-5 w-5" />}>
            New Lab Order
          </Button>
        }
      />

      <LabOrdersStatCards orders={labOrders} />

      <LabOrdersTable
        orders={labOrders}
        isLoading={isLoading}
        onNew={openModal}
      />

      {showModal && (
        <LabOrderFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default LabOrdersPage;
