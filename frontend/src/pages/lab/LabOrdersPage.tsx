// Responsibility: Main lab orders management page displaying summary metrics and test orders table

import { useState } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { LabOrdersStatCards } from "./LabOrdersStatCards";
import { LabOrdersTable } from "./LabOrdersTable";
import { LabOrderFormModal } from "./LabOrderFormModal";
import { LabReportPrintModal } from "./LabReportPrintModal";
import { useLabOrdersPage } from "./useLabOrdersPage";
import type { LabOrder } from "@/types";

export const LabOrdersPage = () => {
  const { labOrders, isLoading, showModal, openModal, closeModal, refetch } =
    useLabOrdersPage();
  const [printOrder, setPrintOrder] = useState<LabOrder | null>(null);

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
        onPrint={setPrintOrder}
      />

      {showModal && (
        <LabOrderFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}

      {printOrder && (
        <LabReportPrintModal
          labOrder={printOrder}
          onClose={() => setPrintOrder(null)}
        />
      )}
    </Box>
  );
};

export default LabOrdersPage;
