// Responsibility: Main lab orders management page displaying summary metrics and test orders table

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { LabOrdersStatCards } from "./LabOrdersStatCards";
import { LabOrdersTable } from "./LabOrdersTable";
import { LabOrderFormModal } from "./LabOrderFormModal";
import type { LabOrder } from "@/types";

export const LabOrdersPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: labOrders = [],
    isLoading,
    refetch,
  } = useQuery<LabOrder[]>({
    queryKey: QUERY_KEYS.hospitals.labOrders(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<LabOrder[]>(
        API_ROUTES.hospitals.labOrders(currentHospital.id),
      );
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Lab Orders"
        description="Manage laboratory test orders and results"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            New Lab Order
          </Button>
        }
      />

      <LabOrdersStatCards orders={labOrders} />

      <LabOrdersTable
        orders={labOrders}
        isLoading={isLoading}
        onNew={() => setShowModal(true)}
      />

      {showModal && (
        <LabOrderFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default LabOrdersPage;
