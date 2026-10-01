// Responsibility: Main IPD management page displaying ward occupancy and tabbed beds grid

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { IPDStatCards } from "./IPDStatCards";
import { IPDBedsGrid } from "./IPDBedsGrid";
import { AdmissionFormModal } from "./AdmissionFormModal";
import { buildIPDTabs, type IPDTabId } from "./ipd.config";
import { useIPDPage } from "./useIPDPage";

export const IPDPage = () => {
  const { beds, isLoading, showModal, openModal, closeModal, refetch } =
    useIPDPage();
  const [activeTab, setActiveTab] = useState<IPDTabId>("all");

  const availableBeds = useMemo(
    () => beds.filter((b) => b.status === "available"),
    [beds],
  );
  const occupiedBeds = useMemo(
    () => beds.filter((b) => b.status === "occupied"),
    [beds],
  );

  const tabs = buildIPDTabs(
    beds.length,
    availableBeds.length,
    occupiedBeds.length,
  );

  const displayedBeds = useMemo(() => {
    if (activeTab === "available") return availableBeds;
    if (activeTab === "occupied") return occupiedBeds;
    return beds;
  }, [activeTab, beds, availableBeds, occupiedBeds]);

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

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <IPDBedsGrid
          beds={displayedBeds}
          isLoading={isLoading}
          onNewAdmission={openModal}
        />
      </Box>

      {showModal && (
        <AdmissionFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default IPDPage;
