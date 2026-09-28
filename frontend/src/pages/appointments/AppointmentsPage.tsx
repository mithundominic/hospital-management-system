// Responsibility: Main appointments management page with date selection and booking modal

import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AppointmentFormModal } from "./AppointmentFormModal";
import { AppointmentsTimeline } from "./AppointmentsTimeline";
import { AppointmentsDateFilter } from "./AppointmentsDateFilter";
import { useAppointmentsPage } from "./useAppointmentsPage";

export const AppointmentsPage = () => {
  const {
    selectedDate,
    setSelectedDate,
    showModal,
    setShowModal,
    editingApt,
    setEditingApt,
    cancellingApt,
    setCancellingApt,
    appointments,
    isLoading,
    refetch,
    handleConfirmCancel,
  } = useAppointmentsPage();

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage patient appointments and scheduling"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            New Appointment
          </Button>
        }
      />

      <AppointmentsDateFilter
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        count={appointments.length}
      />

      <AppointmentsTimeline
        isLoading={isLoading}
        appointments={appointments}
        onEdit={(apt) => {
          setEditingApt(apt);
          setShowModal(true);
        }}
        onCancel={(apt) => setCancellingApt(apt)}
        onNew={() => setShowModal(true)}
      />

      {showModal && (
        <AppointmentFormModal
          appointment={editingApt}
          onClose={() => {
            setShowModal(false);
            setEditingApt(null);
          }}
          onSuccess={() => refetch()}
        />
      )}

      <ConfirmDialog
        isOpen={!!cancellingApt}
        onClose={() => setCancellingApt(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
      />
    </Box>
  );
};

export default AppointmentsPage;
