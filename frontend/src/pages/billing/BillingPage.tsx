// Responsibility: Main billing and invoices page with summary KPI cards and invoices table

import { useState } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { BillingStatCards } from "./BillingStatCards";
import { BillingTable } from "./BillingTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import { InvoicePrintModal } from "./InvoicePrintModal";
import { useBillingPage } from "./useBillingPage";
import type { Invoice } from "@/types";

export const BillingPage = () => {
  const { invoices, isLoading, showModal, openModal, closeModal, refetch } =
    useBillingPage();
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

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

      <BillingTable
        invoices={invoices}
        isLoading={isLoading}
        onNew={openModal}
        onPrint={setPrintInvoice}
      />

      {showModal && (
        <InvoiceFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}

      {printInvoice && (
        <InvoicePrintModal
          invoice={printInvoice}
          onClose={() => setPrintInvoice(null)}
        />
      )}
    </Box>
  );
};

export default BillingPage;
