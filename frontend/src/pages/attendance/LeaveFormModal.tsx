// Responsibility: Modal form for submitting leave applications using UI primitives
 
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Flex } from "@/components/ui/Flex";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { LEAVE_TYPE_OPTIONS } from "./attendance.config";
import { useLeaveForm } from "./useLeaveForm";

interface LeaveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeaveFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: LeaveFormModalProps) => {
  const { formData, isSubmitting, handleChange, handleSubmit } =
    useLeaveForm(onSuccess);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Type"
          value={formData.leave_type}
          onChange={(e) => handleChange("leave_type", e.target.value)}
          required
          options={LEAVE_TYPE_OPTIONS}
        />

        <Input
          label="Start Date"
          type="date"
          value={formData.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          required
        />

        <Input
          label="End Date"
          type="date"
          value={formData.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
          required
        />

        <Textarea
          label="Reason"
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Enter reason for leave..."
          rows={3}
        />

        <Flex justify="end" className="gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};
