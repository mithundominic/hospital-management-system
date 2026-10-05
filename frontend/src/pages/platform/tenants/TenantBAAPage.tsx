// Responsibility: BAA documents management for a tenant

import { useState } from "react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BAADocumentsTable } from "./BAADocumentsTable";
import { BAAUploadModal } from "./BAAUploadModal";
import { useBAADocuments } from "./useBAADocuments";
import type { Tenant } from "@/types/platform";

interface Props {
  tenant: Tenant;
  onBack: () => void;
}

export const TenantBAAPage = ({ tenant, onBack }: Props) => {
  const { documents, isLoading, refetch } = useBAADocuments(tenant.id);
  const [uploadOpen, setUploadOpen] = useState(false);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title={`BAA Documents - ${tenant.name}`}
        description="Manage Business Associate Agreement documents"
        action={
          <>
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={() => setUploadOpen(true)}>
              Upload BAA Document
            </Button>
          </>
        }
      />

      <BAADocumentsTable documents={documents} />

      <BAAUploadModal
        tenant={tenant}
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={refetch}
      />
    </Box>
  );
};
