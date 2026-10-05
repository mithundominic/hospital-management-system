// Responsibility: Manage modal state and action handlers for tenant management

import { useState } from "react";
import type { Tenant } from "@/types/platform";

export const useTenantModals = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [brandingOpen, setBrandingOpen] = useState(false);

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDetailsOpen(true);
  };

  const handleEditBranding = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setBrandingOpen(true);
  };

  const handleSuspend = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setSuspendOpen(true);
  };

  return {
    selectedTenant,
    detailsOpen,
    setDetailsOpen,
    suspendOpen,
    setSuspendOpen,
    createOpen,
    setCreateOpen,
    brandingOpen,
    setBrandingOpen,
    handleViewDetails,
    handleEditBranding,
    handleSuspend,
  } as const;
};
