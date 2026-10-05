// Responsibility: Main staff management page with search, table/cards view, and invite modal
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { ViewModeToggle } from "@/components/common/ViewModeToggle";
import { StaffTable } from "./StaffTable";
import { StaffInviteFormModal } from "./StaffInviteFormModal";
import { useStaffPage } from "./useStaffPage";
import type { ViewMode } from "@/types/table.types";

export const StaffPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const { memberships, isLoading, showModal, openModal, closeModal, refetch } =
    useStaffPage();

  const filteredMemberships = useMemo(() => {
    if (!searchTerm.trim()) return memberships;
    const term = searchTerm.toLowerCase();
    return memberships.filter(
      (m) =>
        (m.user_name && m.user_name.toLowerCase().includes(term)) ||
        (m.user_email && m.user_email.toLowerCase().includes(term)) ||
        (m.role_name && m.role_name.toLowerCase().includes(term)) ||
        (m.user_phone && m.user_phone.toLowerCase().includes(term)),
    );
  }, [memberships, searchTerm]);

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage hospital staff memberships and role allocations"
        action={
          <Flex align="center" className="gap-2.5">
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
            <Button onClick={openModal} icon={<Plus className="h-5 w-5" />}>
              Invite Staff
            </Button>
          </Flex>
        }
      >
        <SearchBar
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={setSearchTerm}
          noCard
        />
      </PageHeader>

      <StaffTable
        memberships={filteredMemberships}
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onInvite={openModal}
      />

      {showModal && (
        <StaffInviteFormModal
          onClose={closeModal}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default StaffPage;
