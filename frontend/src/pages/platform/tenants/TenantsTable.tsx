// Responsibility: Display tenants in sortable, filterable table or cards grid using reusable DataTable
import { Building, MoreHorizontal } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/common/DataTable";
import { TenantStatusBadge } from "./TenantStatusBadge";
import { TenantCard } from "./TenantCard";
import type { Tenant } from "@/types/platform";
import type { TableColumn } from "@/types/table.types";

const TENANT_COLUMNS: TableColumn<Tenant>[] = [
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
  { key: "location", header: "Location" },
  { key: "timezone", header: "Timezone" },
  { key: "currency", header: "Currency" },
  { key: "created", header: "Created" },
  { key: "actions", header: "Actions", headerClassName: "text-right" },
];

interface TenantsTableProps {
  tenants: Tenant[];
  onViewDetails: (tenant: Tenant) => void;
  onSuspend: (tenant: Tenant) => void;
  onReactivate: (tenant: Tenant) => void;
  onArchive: (tenant: Tenant) => void;
}

export const TenantsTable = ({
  tenants,
  onViewDetails,
}: TenantsTableProps) => (
  <DataTable
    columns={TENANT_COLUMNS}
    data={tenants}
    showViewToggle={true}
    emptyIcon={Building}
    emptyTitle="No tenants found"
    emptyDescription="Registered hospital tenants will appear here."
    renderRow={(tenant) => (
      <TableRow key={tenant.id}>
        <TableCell className="font-medium">{tenant.name}</TableCell>
        <TableCell>
          <TenantStatusBadge status={tenant.status} />
        </TableCell>
        <TableCell>{tenant.address || "—"}</TableCell>
        <TableCell>{tenant.timezone}</TableCell>
        <TableCell>{tenant.currency}</TableCell>
        <TableCell>
          {new Date(tenant.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(tenant)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )}
    renderCard={(tenant) => (
      <TenantCard
        key={tenant.id}
        tenant={tenant}
        onViewDetails={onViewDetails}
      />
    )}
  />
);

export default TenantsTable;
