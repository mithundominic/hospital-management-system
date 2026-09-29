// Responsibility: Render single clinical encounter summary item with status badges

import { format } from "date-fns";
import { FileText, Calendar } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { encounterTypeConfig } from "@/configs/status.config";
import type { Encounter } from "@/types";

export interface EncounterListItemProps {
  encounter: Encounter & { patient?: { full_name: string } };
}

export const EncounterListItem = ({ encounter }: EncounterListItemProps) => {
  const typeConfig = encounterTypeConfig[encounter.encounter_type] ?? {
    label: encounter.encounter_type.toUpperCase(),
    variant: "default",
  };
  return (
    <Box className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <Flex align="start" justify="between">
        <Box className="flex-1">
          <Flex align="center" gap={3} className="mb-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <Text weight="medium">
              {encounter.patient?.full_name ||
                `Patient #${encounter.patient_id.slice(0, 8)}`}
            </Text>
            <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
          </Flex>

          <Box className="text-sm text-gray-600 space-y-1">
            <Text size="sm">
              <Text as="span" weight="medium">
                Chief Complaint:{" "}
              </Text>
              {encounter.chief_complaint || "N/A"}
            </Text>
            {encounter.diagnosis && (
              <Text size="sm">
                <Text as="span" weight="medium">
                  Diagnosis:{" "}
                </Text>
                {encounter.diagnosis}
              </Text>
            )}
          </Box>
        </Box>

        <Flex align="center" gap={1} className="text-gray-400 text-xs">
          <Calendar className="h-4 w-4" />
          <Text size="xs" variant="caption">
            {encounter.created_at
              ? format(new Date(encounter.created_at), "dd MMM yyyy")
              : "N/A"}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
