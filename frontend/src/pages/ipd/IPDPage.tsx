// Responsibility: Main IPD management page displaying ward occupancy and admissions registry

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { IPDStatCards } from "./IPDStatCards";
import { IPDBedsGrid } from "./IPDBedsGrid";
import { AdmissionFormModal } from "./AdmissionFormModal";
import type { Bed } from "@/types";

export const IPDPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: beds = [],
    isLoading,
    refetch,
  } = useQuery<Bed[]>({
    queryKey: QUERY_KEYS.hospitals.beds(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Bed[]>(API_ROUTES.hospitals.beds(currentHospital.id));
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="IPD Management"
        description="Manage beds, ward allocation, and patient admissions"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            New Admission
          </Button>
        }
      />

      <IPDStatCards beds={beds} />

      <IPDBedsGrid
        beds={beds}
        isLoading={isLoading}
        onNewAdmission={() => setShowModal(true)}
      />

      {showModal && (
        <AdmissionFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default IPDPage;
