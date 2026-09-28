// Responsibility: Main patients management page with search, table view, and registration modal

import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { PatientTable } from "./PatientTable";
import { PatientFormModal } from "./PatientFormModal";
import { usePatientsPage } from "./usePatientsPage";
import { buildPatientDetailRoute } from "@/constants";

export const PatientsPage = () => {
  const navigate = useNavigate();
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

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage patient records and registrations"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Register Patient
          </Button>
        }
      />

      <SearchBar
        placeholder="Search by name, MRN, or phone number..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {isLoading ? (
        <Card className="p-4">
          <SkeletonTable rows={8} columns={6} />
        </Card>
      ) : (
        <PatientTable
          patients={filteredPatients}
          onEdit={(p) => {
            setEditingPatient(p);
            setShowModal(true);
          }}
          onSelect={(id) => navigate(buildPatientDetailRoute(id))}
          onRegister={() => setShowModal(true)}
        />
      )}

      {showModal && (
        <PatientFormModal
          patient={editingPatient}
          onClose={() => {
            setShowModal(false);
            setEditingPatient(null);
          }}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default PatientsPage;
