// Responsibility: Main lab orders management page displaying summary metrics and tabbed orders table

import { useState, useMemo, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { LabOrdersStatCards } from "./LabOrdersStatCards";
import { LabOrdersTable } from "./LabOrdersTable";
import { LabOrderFormModal } from "./LabOrderFormModal";
import { buildLabOrdersTabs, type LabOrdersTabId } from "./lab.config";
import { useLabOrdersPage } from "./useLabOrdersPage";
import type { LabOrder } from "@/types";

const LabReportPrintModal = lazy(() => import("./LabReportPrintModal"));

export const LabOrdersPage = () => {
  const { labOrders, isLoading, showModal, openModal, closeModal, refetch } = useLabOrdersPage();
  const [activeTab, setActiveTab] = useState<LabOrdersTabId>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [printOrder, setPrintOrder] = useState<LabOrder | null>(null);

  const pending = useMemo(
    () => labOrders.filter((o) => o.status !== "completed" && o.status !== "cancelled"),
    [labOrders],
  );
  const completed = useMemo(() => labOrders.filter((o) => o.status === "completed"), [labOrders]);

  const tabs = buildLabOrdersTabs(labOrders.length, pending.length, completed.length);

  const displayedOrders = useMemo(() => {
    let list = labOrders;
    if (activeTab === "pending") list = pending;
    if (activeTab === "completed") list = completed;
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (o) =>
        o.test_name?.toLowerCase().includes(term) ||
        o.test_code?.toLowerCase().includes(term) ||
        o.notes?.toLowerCase().includes(term),
    );
  }, [activeTab, labOrders, pending, completed, searchTerm]);

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
      >
        <SearchBar
          placeholder="Search by test name or order number..."
          value={searchTerm}
          onChange={setSearchTerm}
          noCard
        />
      </PageHeader>

      <LabOrdersStatCards orders={labOrders} />

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <LabOrdersTable
          orders={displayedOrders}
          isLoading={isLoading}
          onNew={openModal}
          onPrint={setPrintOrder}
        />
      </Box>

      {showModal && <LabOrderFormModal onClose={closeModal} onSuccess={() => refetch()} />}
      {printOrder && (
        <Suspense fallback={null}>
          <LabReportPrintModal labOrder={printOrder} onClose={() => setPrintOrder(null)} />
        </Suspense>
      )}
    </Box>
  );
};

export default LabOrdersPage;
