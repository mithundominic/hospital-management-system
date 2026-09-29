// Responsibility: Modal container for IPD patient admission and bed allocation

import { FormModal } from "@/components/common/FormModal";
import { useAdmissionForm } from "./useAdmissionForm";
import { AdmissionFormFields } from "./AdmissionFormFields";
import type { AdmissionFormModalProps } from "./ipd.types";

export const AdmissionFormModal = ({
  onClose,
  onSuccess,
  admission,
}: AdmissionFormModalProps) => {
  const {
    loading,
    formData,
    updateField,
    patients,
    beds,
    doctors,
    handleSubmit,
  } = useAdmissionForm(onClose, onSuccess, admission);

  const patientOpts = [
    { value: "", label: "Select Patient" },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  const bedOpts = [
    { value: "", label: "Select Available Bed" },
    ...beds.map((b) => ({
      value: b.id,
      label: `${b.ward_name} - Bed ${b.bed_number} (${b.bed_type})`,
    })),
  ];

  const doctorOpts = [
    { value: "", label: "Select Admitting Doctor" },
    ...doctors.map((d) => ({
      value: d.id,
      label: `Dr. (${d.specialization || "General"})`,
    })),
  ];

  return (
    <FormModal
      isOpen={true}
      onClose={onClose}
      title={admission ? "Update Admission" : "Admit Patient"}
      maxWidth="2xl"
      onSubmit={handleSubmit}
      submitLabel={admission ? "Update Admission" : "Admit Patient"}
      isLoading={loading}
    >
      <AdmissionFormFields
        formData={formData}
        updateField={updateField}
        patientOpts={patientOpts}
        bedOpts={bedOpts}
        doctorOpts={doctorOpts}
      />
    </FormModal>
  );
};

export default AdmissionFormModal;
