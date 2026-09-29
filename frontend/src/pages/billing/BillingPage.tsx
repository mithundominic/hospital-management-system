// Responsibility: Main billing and invoices page with summary KPI cards and invoices table

import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { BillingStatCards } from "./BillingStatCards";
import { BillingTable } from "./BillingTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import { useBillingPage } from "./useBillingPage";

export const BillingPage = () => {
  const { invoices, isLoading, showModal, openModal, closeModal, refetch } =
    useBillingPage();

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
      />

      {showModal && (
        <InvoiceFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default BillingPage;
