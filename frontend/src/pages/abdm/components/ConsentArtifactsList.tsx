// Responsibility: Display list of consent artifacts using reusable DataTable component

import { FileCheck } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { abdmConsentStatusConfig } from "@/configs/status.config";
import { CONSENT_ARTIFACT_COLUMNS } from "../abdm.config";
import type { ConsentArtifact } from "../abdm.types";

interface ConsentArtifactsListProps {
  artifacts: ConsentArtifact[];
}

export function ConsentArtifactsList({ artifacts }: ConsentArtifactsListProps) {
  return (
    <DataTable
      columns={CONSENT_ARTIFACT_COLUMNS}
      data={artifacts}
      emptyIcon={FileCheck}
      emptyTitle="No consent requests found"
      emptyDescription="No consent requests have been recorded for this patient."
      containerClassName="max-h-[460px] overflow-auto"
      renderRow={(artifact) => {
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
      }}
    />
  );
}

export default ConsentArtifactsList;
