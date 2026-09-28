// Responsibility: Main billing and invoices page with summary KPI cards and invoices table

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { BillingStatCards } from "./BillingStatCards";
import { BillingTable } from "./BillingTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import type { Invoice } from "@/types";

export const BillingPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: invoices = [],
    isLoading,
    refetch,
  } = useQuery<Invoice[]>({
    queryKey: QUERY_KEYS.hospitals.invoices(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Invoice[]>(
        API_ROUTES.hospitals.invoices(currentHospital.id),
      );
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Billing & Invoices"
        description="Manage patient invoices, taxes, and payments"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            New Invoice
          </Button>
        }
      />

      <BillingStatCards invoices={invoices} />

      <BillingTable
        invoices={invoices}
        isLoading={isLoading}
        onNew={() => setShowModal(true)}
      />

      {showModal && (
        <InvoiceFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default BillingPage;
