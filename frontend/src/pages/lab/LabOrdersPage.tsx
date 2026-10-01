// Responsibility: Main lab orders management page displaying summary metrics and tabbed orders table

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { LabOrdersStatCards } from "./LabOrdersStatCards";
import { LabOrdersTable } from "./LabOrdersTable";
import { LabOrderFormModal } from "./LabOrderFormModal";
import {
  buildLabOrdersTabs,
  type LabOrdersTabId,
} from "./lab.config";
import { useLabOrdersPage } from "./useLabOrdersPage";

export const LabOrdersPage = () => {
  const {
    labOrders,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } = useLabOrdersPage();
  const [activeTab, setActiveTab] = useState<LabOrdersTabId>("all");

  const pendingOrders = useMemo(
    () => labOrders.filter((o) => o.status === "pending"),
    [labOrders],
  );
  const completedOrders = useMemo(
    () => labOrders.filter((o) => o.status === "completed"),
    [labOrders],
  );

  const tabs = buildLabOrdersTabs(
    labOrders.length,
    pendingOrders.length,
    completedOrders.length,
  );

  const displayedOrders = useMemo(() => {
    if (activeTab === "pending") return pendingOrders;
    if (activeTab === "completed") return completedOrders;
    return labOrders;
  }, [activeTab, labOrders, pendingOrders, completedOrders]);

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

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <LabOrdersTable
          orders={displayedOrders}
          isLoading={isLoading}
          onNew={openModal}
        />
      </Box>

      {showModal && (
        <LabOrderFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default LabOrdersPage;
