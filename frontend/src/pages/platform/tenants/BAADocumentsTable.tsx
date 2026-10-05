// Responsibility: Display list of BAA documents using reusable DataTable component

import { FileText, ExternalLink } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/components/ui/Link";
import { DataTable } from "@/components/common/DataTable";
import type { BAADocument } from "@/types/platform";
import type { TableColumn } from "@/types/table.types";

const BAA_COLUMNS: TableColumn<BAADocument>[] = [
  { key: "url", header: "Document URL" },
  { key: "signed", header: "Signed Date" },
  { key: "expires", header: "Expires Date" },
  { key: "status", header: "Status" },
  { key: "created", header: "Created" },
];

const getStatus = (expiresAt?: string) => {
  if (!expiresAt) return { label: "Active", variant: "success" as const };
  const expiryDate = new Date(expiresAt);
  return expiryDate < new Date()
    ? { label: "Expired", variant: "danger" as const }
    : { label: "Active", variant: "success" as const };
};

interface Props {
  documents: BAADocument[];
}

export const BAADocumentsTable = ({ documents }: Props) => (
  <DataTable
    columns={BAA_COLUMNS}
    data={documents}
    emptyIcon={FileText}
    emptyTitle="No BAA documents uploaded"
    emptyDescription="Business Associate Agreement documents will appear here."
    renderRow={(doc) => {
      const status = getStatus(doc.expires_at);
      return (
        <TableRow key={doc.id}>
          <TableCell>
            <Link
              href={doc.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              View <ExternalLink className="h-3 w-3" />
            </Link>
          </TableCell>
          <TableCell>{doc.signed_at ? new Date(doc.signed_at).toLocaleDateString() : "—"}</TableCell>
          <TableCell>{doc.expires_at ? new Date(doc.expires_at).toLocaleDateString() : "—"}</TableCell>
          <TableCell>
            <Badge variant={status.variant}>{status.label}</Badge>
          </TableCell>
          <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
        </TableRow>
      );
    }}
  />
);

export default BAADocumentsTable;
