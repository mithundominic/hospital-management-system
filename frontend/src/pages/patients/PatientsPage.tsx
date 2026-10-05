// Responsibility: Main patients management page with search, table/cards view, and registration modal
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { ViewModeToggle } from "@/components/common/ViewModeToggle";
import { PatientTable } from "./PatientTable";
import { PatientFormModal } from "./PatientFormModal";
import { usePatientsPage } from "./usePatientsPage";
import { buildPatientDetailRoute } from "@/constants";
import type { Patient } from "@/types";
import type { ViewMode } from "@/types/table.types";

export const PatientsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const {
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    editingPatient,
    setEditingPatient,
    filteredPatients,
    isLoading,
    refetch,
  } = usePatientsPage();

  const handleEdit = useCallback(
    (p: Patient) => {
      setEditingPatient(p);
      setShowModal(true);
    },
    [setEditingPatient, setShowModal],
  );

  const handleSelect = useCallback(
    (id: string) => navigate(buildPatientDetailRoute(id)),
    [navigate],
  );

  const handleRegister = useCallback(() => setShowModal(true), [setShowModal]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingPatient(null);
  }, [setShowModal, setEditingPatient]);

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage patient records and registrations"
        action={
          <Flex align="center" className="gap-2.5">
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
            <Button onClick={handleRegister} icon={<Plus className="h-5 w-5" />}>
              Register Patient
            </Button>
          </Flex>
        }
      >
        <SearchBar
          placeholder="Search by name, MRN, or phone number..."
          value={searchTerm}
          onChange={setSearchTerm}
          noCard
        />
      </PageHeader>

      <PatientTable
        patients={filteredPatients}
        viewMode={viewMode}
        isLoading={isLoading}
        onEdit={handleEdit}
        onSelect={handleSelect}
        onRegister={handleRegister}
      />

      {showModal && (
        <PatientFormModal
          patient={editingPatient}
          onClose={handleCloseModal}
          onSuccess={refetch}
        />
      )}
    </Box>
  );
};

export default PatientsPage;
