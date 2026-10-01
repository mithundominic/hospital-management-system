// Responsibility: Main billing and invoices page with summary KPI cards and tabbed status invoices table

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { BillingStatCards } from "./BillingStatCards";
import { BillingTable } from "./BillingTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import {
  buildBillingTabs,
  type BillingTabId,
} from "./billing.config";
import { useBillingPage } from "./useBillingPage";

export const BillingPage = () => {
  const {
    invoices,
    isLoading,
    showModal,
    openModal,
    closeModal,
    refetch,
  } = useBillingPage();
  const [activeTab, setActiveTab] = useState<BillingTabId>("all");

  const pendingInvoices = useMemo(
    () =>
      invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled"),
    [invoices],
  );
  const paidInvoices = useMemo(
    () => invoices.filter((i) => i.status === "paid"),
    [invoices],
  );

  const tabs = buildBillingTabs(
    invoices.length,
    pendingInvoices.length,
    paidInvoices.length,
  );

  const displayedInvoices = useMemo(() => {
    if (activeTab === "pending") return pendingInvoices;
    if (activeTab === "paid") return paidInvoices;
    return invoices;
  }, [activeTab, invoices, pendingInvoices, paidInvoices]);

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Billing & Invoices"
        description="Manage patient invoices, taxes, and payments"
        action={
          <Button onClick={openModal} icon={<Plus className="h-5 w-5" />}>
            New Invoice
          </Button>
        }
      />

      <BillingStatCards invoices={invoices} />

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <BillingTable
          invoices={displayedInvoices}
          isLoading={isLoading}
          onNew={openModal}
        />
      </Box>

      {showModal && (
        <InvoiceFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default BillingPage;
