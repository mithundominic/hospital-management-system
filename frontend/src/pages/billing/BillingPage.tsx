// Responsibility: Main billing and invoices page with summary KPI cards and tabbed status invoices table

import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { BillingStatCards } from "./BillingStatCards";
import { BillingTable } from "./BillingTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import { buildBillingTabs, type BillingTabId } from "./billing.config";
import { useBillingPage } from "./useBillingPage";
import type { Invoice } from "@/types";

const InvoicePrintModal = lazy(() => import("./InvoicePrintModal"));

export const BillingPage = () => {
  const { invoices, isLoading, showModal, openModal, closeModal, refetch } = useBillingPage();
  const [activeTab, setActiveTab] = useState<BillingTabId>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  const pendingInvoices = useMemo(
    () => invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled"),
    [invoices],
  );
  const paidInvoices = useMemo(
    () => invoices.filter((i) => i.status === "paid"),
    [invoices],
  );

  const tabs = buildBillingTabs(invoices.length, pendingInvoices.length, paidInvoices.length);

  const displayedInvoices = useMemo(() => {
    let list = invoices;
    if (activeTab === "pending") list = pendingInvoices;
    if (activeTab === "paid") list = paidInvoices;
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (inv) =>
        inv.invoice_number?.toLowerCase().includes(term) ||
        inv.notes?.toLowerCase().includes(term) ||
        inv.patient_id?.toLowerCase().includes(term),
    );
  }, [activeTab, invoices, pendingInvoices, paidInvoices, searchTerm]);

  const handlePrint = useCallback((inv: Invoice) => setPrintInvoice(inv), []);
  const handleClosePrint = useCallback(() => setPrintInvoice(null), []);

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
      >
        <SearchBar
          placeholder="Search by invoice number or patient..."
          value={searchTerm}
          onChange={setSearchTerm}
          noCard
        />
      </PageHeader>

      <BillingStatCards invoices={invoices} />

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <BillingTable
          invoices={displayedInvoices}
          isLoading={isLoading}
          onNew={openModal}
          onPrint={handlePrint}
        />
      </Box>

      {showModal && <InvoiceFormModal onClose={closeModal} onSuccess={refetch} />}
      {printInvoice && (
        <Suspense fallback={null}>
          <InvoicePrintModal invoice={printInvoice} onClose={handleClosePrint} />
        </Suspense>
      )}
    </Box>
  );
};

export default BillingPage;
