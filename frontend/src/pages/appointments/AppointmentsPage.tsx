// Responsibility: Main appointments management page with date selection and booking modal

import { useCallback } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AppointmentFormModal } from "./AppointmentFormModal";
import { AppointmentsTimeline } from "./AppointmentsTimeline";
import { AppointmentsDateFilter } from "./AppointmentsDateFilter";
import { useAppointmentsPage } from "./useAppointmentsPage";
import type { Appointment } from "@/types";

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

  const handleOpenNew = useCallback(() => setShowModal(true), [setShowModal]);
  const handleEdit = useCallback(
    (apt: Appointment) => {
      setEditingApt(apt);
      setShowModal(true);
    },
    [setEditingApt, setShowModal],
  );
  const handleCancel = useCallback(
    (apt: Appointment) => setCancellingApt(apt),
    [setCancellingApt],
  );
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingApt(null);
  }, [setShowModal, setEditingApt]);
  const handleCloseConfirm = useCallback(
    () => setCancellingApt(null),
    [setCancellingApt],
  );

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage patient appointments and scheduling"
        action={
          <Button onClick={handleOpenNew} icon={<Plus className="h-5 w-5" />}>
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
        onEdit={handleEdit}
        onCancel={handleCancel}
        onNew={handleOpenNew}
      />

      {showModal && (
        <AppointmentFormModal
          appointment={editingApt}
          onClose={handleCloseModal}
          onSuccess={refetch}
        />
      )}

      <ConfirmDialog
        isOpen={!!cancellingApt}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
      />
    </Box>
  );
};

export default AppointmentsPage;
