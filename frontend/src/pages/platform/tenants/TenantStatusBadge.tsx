// Responsibility: Display tenant status with appropriate styling

import { Badge } from "@/components/ui/Badge";
import type { TenantStatus } from "@/types/platform";
import { STATUS_CONFIG } from "./tenant.config";

interface TenantStatusBadgeProps {
  status: TenantStatus;
}

export const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
