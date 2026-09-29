// Responsibility: Main encounters management page listing clinical visits with modal creation

import { Plus, FileText } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonList } from "@/components/common/SkeletonList";
import { EmptyState } from "@/components/common/EmptyState";
import { EncounterListItem } from "./EncounterListItem";
import { EncounterFormModal } from "./EncounterFormModal";
import { useEncountersPage } from "./useEncountersPage";

export const EncountersPage = () => {
  const { encounters, isLoading, showModal, openModal, closeModal, refetch } =
    useEncountersPage();

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Clinical Encounters"
        description="Document patient visits and consultations"
        action={
          <Button onClick={openModal} icon={<Plus className="h-5 w-5" />}>
            New Encounter
          </Button>
        }
      />

      <Card className="p-6">
        {isLoading ? (
          <SkeletonList items={5} />
        ) : encounters.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No encounters found"
            description="Start documenting clinical consultations and encounters."
            actionLabel="New Encounter"
            onAction={openModal}
          />
        ) : (
          <Box className="space-y-4">
            {encounters.map((encounter) => (
              <EncounterListItem key={encounter.id} encounter={encounter} />
            ))}
          </Box>
        )}
      </Card>

      {showModal && (
        <EncounterFormModal onClose={closeModal} onSuccess={() => refetch()} />
      )}
    </Box>
  );
};

export default EncountersPage;
