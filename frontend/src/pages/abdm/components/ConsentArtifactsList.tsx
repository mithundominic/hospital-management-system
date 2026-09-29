// Responsibility: Display list of consent artifacts in a structured table

import { FileCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { abdmConsentStatusConfig } from "@/configs/status.config";
import { CONSENT_ARTIFACT_COLUMNS } from "../abdm.config";
import type { ConsentArtifact } from "../abdm.types";

interface ConsentArtifactsListProps {
  artifacts: ConsentArtifact[];
}

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
      <Heading level={3} className="mb-4">
        Consent Artifacts
      </Heading>
      <Table>
        <DataTableHeader columns={CONSENT_ARTIFACT_COLUMNS} />
        <TableBody>
          {artifacts.map((artifact) => {
            const statusConfig = abdmConsentStatusConfig[artifact.status] ?? {
              label: artifact.status.toUpperCase(),
              variant: "default",
            };
            return (
              <TableRow key={artifact.id}>
                <TableCell>{artifact.purpose}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>{artifact.consent_request_id || "-"}</TableCell>
                <TableCell>{artifact.artifact_id || "-"}</TableCell>
                <TableCell>
                  {new Date(artifact.requested_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {artifact.resolved_at
                    ? new Date(artifact.resolved_at).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
