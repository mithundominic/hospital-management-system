// Responsibility: Display list of ABHA verification requests

import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import type { LinkRequest } from "../abdm.types";

interface AbhaVerificationListProps {
  requests: LinkRequest[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function AbhaVerificationList({
  requests,
  onSelect,
  selectedId,
}: AbhaVerificationListProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No verification requests found"
        description="No ABHA verification requests have been initiated for this patient."
      />
    );
  }

  return (
    <Card className="p-6">
      <Heading level={3} className="mb-4">Verification History</Heading>
      <Box className="space-y-3">
        {requests.map((request) => (
          <Box
            key={request.id}
            onClick={() => onSelect(request.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedId === request.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Flex justify="between" align="center" className="mb-1">
              <Text weight="medium">Type: {request.link_type}</Text>
              <Badge variant={request.status === "active" ? "success" : "default"}>
                {request.status}
              </Badge>
            </Flex>
            <Text size="sm" variant="muted">
              Initiated: {new Date(request.initiated_at).toLocaleString()}
              {request.resolved_at && ` | Resolved: ${new Date(request.resolved_at).toLocaleString()}`}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
