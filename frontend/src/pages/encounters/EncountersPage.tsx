// Responsibility: Main encounters management page listing clinical visits with modal creation

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileText } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonList } from "@/components/common/SkeletonList";
import { EmptyState } from "@/components/common/EmptyState";
import { EncounterListItem } from "./EncounterListItem";
import { EncounterFormModal } from "./EncounterFormModal";
import type { Encounter } from "@/types";

export const EncountersPage = () => {
  const { currentHospital } = useHospital();
  const [showModal, setShowModal] = useState(false);

  const {
    data: encounters = [],
    isLoading,
    refetch,
  } = useQuery<Encounter[]>({
    queryKey: QUERY_KEYS.hospitals.encounters(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Encounter[]>(
        API_ROUTES.hospitals.encounters(currentHospital.id),
      );
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Clinical Encounters"
        description="Document patient visits and consultations"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
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
            onAction={() => setShowModal(true)}
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
        <EncounterFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default EncountersPage;
