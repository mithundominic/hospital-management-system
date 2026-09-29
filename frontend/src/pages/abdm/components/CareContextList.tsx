// Responsibility: Display available care contexts for ABDM linking

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { careContextStatusConfig } from "@/configs/status.config";
import type { AbdmEncounter } from "../abdm.types";

interface CareContextListProps {
  encounters: AbdmEncounter[];
  onSelect: (encounterId: string) => void;
  selectedId?: string;
}

export function CareContextList({
  encounters,
  onSelect,
  selectedId,
}: CareContextListProps) {
  if (encounters.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No encounters available"
        description="No encounters are available to link for this patient."
      />
    );
  }

  return (
    <Card className="p-6 mb-6">
      <Heading level={3} className="mb-4">
        Available Care Contexts
      </Heading>
      <Box className="space-y-3">
        {encounters.map((encounter) => (
          <Box
            key={encounter.id}
            onClick={() => onSelect(encounter.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedId === encounter.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Flex justify="between" align="center" className="mb-1">
              <Text weight="medium">
                Type: {encounter.encounter_type.toUpperCase()}
              </Text>
              <Badge
                variant={
                  careContextStatusConfig[encounter.status]?.variant ||
                  "default"
                }
              >
                {careContextStatusConfig[encounter.status]?.label ||
                  encounter.status}
              </Badge>
            </Flex>
            {encounter.chief_complaint && (
              <Text size="sm" className="text-gray-700">
                Complaint: {encounter.chief_complaint}
              </Text>
            )}
            {encounter.diagnosis && (
              <Text size="sm" className="text-gray-700">
                Diagnosis: {encounter.diagnosis}
              </Text>
            )}
            <Text size="xs" variant="muted" className="mt-1">
              {new Date(encounter.started_at).toLocaleString()}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
