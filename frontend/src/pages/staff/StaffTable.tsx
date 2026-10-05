// Responsibility: Render staff memberships in table or cards view using reusable DataTable
import { Users } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { STAFF_TABLE_COLUMNS } from "./staff.config";
import { StaffTableRow } from "./StaffTableRow";
import { StaffMemberCard } from "./StaffMemberCard";
import type { MembershipDto } from "@/services/staff.service";
import type { ViewMode } from "@/types/table.types";

export interface StaffTableProps {
  memberships: MembershipDto[];
  isLoading?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onInvite: () => void;
}

export const StaffTable = ({
  memberships,
  isLoading,
  viewMode,
  onViewModeChange,
  onInvite,
}: StaffTableProps) => (
  <DataTable
    columns={STAFF_TABLE_COLUMNS}
    data={memberships}
    isLoading={isLoading}
    viewMode={viewMode}
    onViewModeChange={onViewModeChange}
    emptyIcon={Users}
    emptyTitle="No staff members found"
    emptyDescription="Invite colleagues, doctors, nurses, and staff to join this hospital."
    emptyActionLabel="Invite Staff"
    onEmptyAction={onInvite}
    renderRow={(member) => (
      <StaffTableRow key={member.id} member={member} />
    )}
    renderCard={(member) => (
      <StaffMemberCard key={member.id} member={member} />
    )}
  />
);

export default StaffTable;
