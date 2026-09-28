// Responsibility: Display list of consent artifacts in a structured table

import { FileCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import type { ConsentArtifact } from "../abdm.types";

interface ConsentArtifactsListProps {
  artifacts: ConsentArtifact[];
}

const statusVariants: Record<ConsentArtifact["status"], BadgeVariant> = {
  requested: "warning",
  granted: "success",
  denied: "danger",
  expired: "default",
};

export function ConsentArtifactsList({ artifacts }: ConsentArtifactsListProps) {
  if (artifacts.length === 0) {
    return (
      <EmptyState
        icon={FileCheck}
        title="No consent requests found"
        description="No consent requests have been recorded for this patient."
      />
    );
  }

  return (
    <Card className="p-6">
      <Heading level={3} className="mb-4">Consent Artifacts</Heading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Artifact ID</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Resolved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artifacts.map((artifact) => (
            <TableRow key={artifact.id}>
              <TableCell>{artifact.purpose}</TableCell>
              <TableCell>
                <Badge variant={statusVariants[artifact.status]}>
                  {artifact.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{artifact.consent_request_id || "-"}</TableCell>
              <TableCell>{artifact.artifact_id || "-"}</TableCell>
              <TableCell>{new Date(artifact.requested_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {artifact.resolved_at
                  ? new Date(artifact.resolved_at).toLocaleDateString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
