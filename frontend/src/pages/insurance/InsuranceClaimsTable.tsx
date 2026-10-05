// Responsibility: Render the insurance claims data table or cards grid using reusable DataTable
import { Shield } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { INSURANCE_CLAIMS_COLUMNS } from "./insurance.config";
import { InsuranceClaimsTableRow } from "./InsuranceClaimsTableRow";
import { InsuranceClaimCard } from "./InsuranceClaimCard";
import type { InsuranceClaim } from "@/types";
import type { ViewMode } from "@/types/table.types";

export interface InsuranceClaimsTableProps {
  claims: InsuranceClaim[];
  isLoading: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export const InsuranceClaimsTable = ({
  claims,
  isLoading,
  viewMode,
  onViewModeChange,
}: InsuranceClaimsTableProps) => (
  <DataTable
    columns={INSURANCE_CLAIMS_COLUMNS}
    data={claims}
    isLoading={isLoading}
    viewMode={viewMode}
    onViewModeChange={onViewModeChange}
    showViewToggle={true}
    emptyIcon={Shield}
    emptyTitle="No claims filed"
    emptyDescription="Track insurance claims, pre-authorizations, and TPA settlements here."
    renderRow={(claim) => (
      <InsuranceClaimsTableRow key={claim.id} claim={claim} />
    )}
    renderCard={(claim) => (
      <InsuranceClaimCard key={claim.id} claim={claim} />
    )}
  />
);

export default InsuranceClaimsTable;
