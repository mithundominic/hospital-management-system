// Responsibility: Modal container for scheduling shifts with timing presets and staff allocation

import { FormModal } from "@/components/common/FormModal";
import { Box } from "@/components/ui/Box";
import { Select } from "@/components/ui/Select";
import { ShiftTimingFields } from "./ShiftTimingFields";
import { useShiftForm } from "./useShiftForm";
import { type ShiftFormModalProps, shiftTypeOptions } from "./shift.types";

export const ShiftFormModal = ({
  onClose,
  onSuccess,
  shift,
}: ShiftFormModalProps) => {
  const {
    loading,
    formData,
    updateField,
    staffMembers,
    setPreset,
    handleSubmit,
  } = useShiftForm(onClose, onSuccess, shift);

  const staffOpts = [
    { value: "", label: "Select Staff Member" },
    ...staffMembers.map((s) => ({
      value: s.id,
      label: `${s.user_email} (${s.role_name || "Staff"})`,
    })),
  ];

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title={shift ? "Edit Shift" : "Schedule Staff Shift"}
      maxWidth="xl"
      onSubmit={handleSubmit}
      submitLabel={shift ? "Update Shift" : "Schedule Shift"}
      isLoading={loading}
    >
      <Box className="space-y-4">
        <Select
          label="Staff Member *"
          value={formData.staff_id}
          onChange={(e) => updateField("staff_id", e.target.value)}
          options={staffOpts}
          required
        />

        <ShiftTimingFields
          formData={formData}
          updateField={updateField}
          setPreset={setPreset}
        />

        <Select
          label="Shift Type"
          value={formData.shift_type}
          onChange={(e) =>
            updateField(
              "shift_type",
              e.target.value as "morning" | "afternoon" | "night",
            )
          }
          options={shiftTypeOptions}
        />
      </Box>
    </FormModal>
  );
};

export default ShiftFormModal;
