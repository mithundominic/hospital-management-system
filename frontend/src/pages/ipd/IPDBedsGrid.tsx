// Responsibility: Render IPD ward beds status grid and availability badges

import { Bed } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import type { Bed as BedType } from "@/types";

export interface IPDBedsGridProps {
  beds: BedType[];
  isLoading: boolean;
  onNewAdmission: () => void;
}

const statusBadgeMap: Record<string, BadgeVariant> = {
  available: "success",
  occupied: "danger",
  maintenance: "warning",
};

export const IPDBedsGrid = ({
  beds,
  isLoading,
  onNewAdmission,
}: IPDBedsGridProps) => {
  if (isLoading) {
    return (
      <Grid cols={3} gap={4}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </Grid>
    );
  }

  if (beds.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Bed}
          title="No hospital beds configured"
          description="Inpatient beds and ward allocation will be displayed here."
          actionLabel="Admit Patient"
          onAction={onNewAdmission}
        />
      </Card>
    );
  }

  return (
    <Grid cols={3} gap={4}>
      {beds.map((b) => (
        <Card key={b.id} className="p-4">
          <Flex align="center" justify="between">
            <Flex align="center" gap={3}>
              <Bed className="h-6 w-6 text-gray-400" />
              <Box>
                <Text weight="semibold">
                  {b.ward_name} - Bed {b.bed_number}
                </Text>
                <Text size="xs" variant="muted">
                  {b.bed_type}
                </Text>
              </Box>
            </Flex>
            <Badge variant={statusBadgeMap[b.status] || "default"}>
              {b.status}
            </Badge>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};
