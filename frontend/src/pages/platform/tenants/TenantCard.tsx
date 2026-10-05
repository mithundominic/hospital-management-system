// Responsibility: Render individual platform tenant in card grid view
import { memo } from "react";
import { Building, MoreHorizontal } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Button } from "@/components/ui/Button";
import { TenantStatusBadge } from "./TenantStatusBadge";
import type { Tenant } from "@/types/platform";

export interface TenantCardProps {
  tenant: Tenant;
  onViewDetails: (tenant: Tenant) => void;
}

export const TenantCard = memo(({ tenant, onViewDetails }: TenantCardProps) => (
  <DataCard
    title={tenant.name}
    subtitle={tenant.timezone ? `${tenant.timezone} • ${tenant.currency}` : tenant.currency}
    icon={<Building className="h-6 w-6" />}
    badge={<TenantStatusBadge status={tenant.status} />}
    fields={[
      { label: "Location", value: tenant.address || "—" },
      { label: "Currency", value: tenant.currency },
      { label: "Created", value: new Date(tenant.created_at).toLocaleDateString() },
    ]}
    actions={
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails(tenant)}
        icon={<MoreHorizontal className="h-3.5 w-3.5" />}
      >
        View Details
      </Button>
    }
    onClick={() => onViewDetails(tenant)}
  />
));

TenantCard.displayName = "TenantCard";

export default TenantCard;
