// Responsibility: View and manage tenant details with action buttons

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { TenantStatusBadge } from "./TenantStatusBadge";
import { Section, InfoRow } from "./TenantInfoSection";
import { Ban, CheckCircle, Archive } from "lucide-react";
import type { Tenant } from "@/types/platform";

interface TenantDetailsModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (tenant: Tenant) => void;
  onReactivate: (tenant: Tenant) => void;
  onArchive: (tenant: Tenant) => void;
}

export const TenantDetailsModal = ({
  tenant,
  isOpen,
  onClose,
  onSuspend,
  onReactivate,
  onArchive,
}: TenantDetailsModalProps) => {
  if (!tenant) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tenant.name} maxWidth="2xl">
      <Box className="space-y-6">
        <Flex className="items-center gap-3 pb-4 border-b">
          <Text className="font-semibold">{tenant.name}</Text>
          <TenantStatusBadge status={tenant.status} />
        </Flex>

        <Section title="Basic Information">
          <InfoRow label="Name" value={tenant.name} />
          <InfoRow label="Address" value={tenant.address} />
          <InfoRow label="Contact" value={tenant.contact} />
          <InfoRow label="License Info" value={tenant.license_info} />
        </Section>

        <Section title="Regional Settings">
          <InfoRow label="Timezone" value={tenant.timezone} />
          <InfoRow label="Locale" value={tenant.locale} />
          <InfoRow label="Currency" value={tenant.currency} />
        </Section>

        {tenant.suspension_reason && (
          <Section title="Suspension Details">
            <InfoRow label="Reason" value={tenant.suspension_reason} />
          </Section>
        )}

        <Flex className="gap-2 pt-4 border-t">
          {tenant.status === "active" && (
            <Button
              variant="danger"
              onClick={() => handleAction(() => onSuspend(tenant))}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          )}
          {tenant.status === "suspended" && (
            <Button onClick={() => handleAction(() => onReactivate(tenant))}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Reactivate
            </Button>
          )}
          {tenant.status !== "archived" && (
            <Button
              variant="outline"
              onClick={() => handleAction(() => onArchive(tenant))}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          )}
        </Flex>
      </Box>
    </Modal>
  );
};
