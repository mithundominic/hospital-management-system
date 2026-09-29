// Responsibility: Main IPD management page displaying ward occupancy and admissions registry

import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { IPDStatCards } from "./IPDStatCards";
import { IPDBedsGrid } from "./IPDBedsGrid";
import { AdmissionFormModal } from "./AdmissionFormModal";
import { useIPDPage } from "./useIPDPage";

export const IPDPage = () => {
  const { beds, isLoading, showModal, openModal, closeModal, refetch } =
    useIPDPage();

  return (
    <Box className="space-y-6">
      <PageHeader
        title="IPD Management"
        description="Manage beds, ward allocation, and patient admissions"
        action={
          <Button onClick={openModal} icon={<Plus className="h-5 w-5" />}>
            New Admission
          </Button>
        }
      />

      <IPDStatCards beds={beds} />

      <IPDBedsGrid
        beds={beds}
        isLoading={isLoading}
        onNewAdmission={openModal}
      />

      {showModal && (
        <AdmissionFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default IPDPage;
