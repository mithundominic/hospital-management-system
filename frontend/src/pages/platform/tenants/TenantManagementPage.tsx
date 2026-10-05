// Responsibility: Main tenant management page with list and actions

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { TenantsTable } from "./TenantsTable";
import { TenantDetailsModal } from "./TenantDetailsModal";
import { SuspendTenantModal } from "./SuspendTenantModal";
import { TenantCreateModal } from "./TenantCreateModal";
import { BrandingModal } from "./BrandingModal";
import { useTenants } from "./useTenants";
import { useTenantActions } from "./useTenantActions";
import { useTenantModals } from "./useTenantModals";

export default function TenantManagementPage() {
  const { tenants, isLoading, refetch } = useTenants();
  const { suspendTenant, reactivateTenant, archiveTenant } = useTenantActions();
  const modals = useTenantModals();

  if (isLoading) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Tenant Management"
        description="Manage hospital tenants and their lifecycle"
        action={
          <Button onClick={() => modals.setCreateOpen(true)}>Create Tenant</Button>
        }
      />

      <TenantsTable
        tenants={tenants}
        onViewDetails={modals.handleViewDetails}
        onSuspend={modals.handleSuspend}
        onReactivate={(t) => reactivateTenant(t.id)}
        onArchive={(t) => archiveTenant(t.id)}
      />

      <TenantCreateModal
        isOpen={modals.createOpen}
        onClose={() => modals.setCreateOpen(false)}
        onSuccess={refetch}
      />

      {modals.selectedTenant && (
        <>
          <BrandingModal
            tenant={modals.selectedTenant}
            isOpen={modals.brandingOpen}
            onClose={() => modals.setBrandingOpen(false)}
            onSuccess={refetch}
          />
          <TenantDetailsModal
            tenant={modals.selectedTenant}
            isOpen={modals.detailsOpen}
            onClose={() => modals.setDetailsOpen(false)}
            onSuspend={modals.handleSuspend}
            onReactivate={(t) => reactivateTenant(t.id)}
            onArchive={(t) => archiveTenant(t.id)}
          />
        </>
      )}

      <SuspendTenantModal
        tenant={modals.selectedTenant}
        isOpen={modals.suspendOpen}
        onClose={() => modals.setSuspendOpen(false)}
        onConfirm={(hospitalId, reason) => suspendTenant({ hospitalId, reason })}
      />
    </Box>
  );
}
