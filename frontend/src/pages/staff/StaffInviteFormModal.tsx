// Responsibility: Modal dialog for onboarding and assigning roles to hospital staff members

import { Mail } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Form } from "@/components/ui/Form";
import { Text } from "@/components/ui/Text";
import { ModalFooter } from "@/components/common/ModalFooter";
import { RoleSelectorGrid } from "./RoleSelectorGrid";
import { useStaffInvite } from "./useStaffInvite";

export interface StaffInviteFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffInviteFormModal = ({
  onClose,
  onSuccess,
}: StaffInviteFormModalProps) => {
  const { loading, email, setEmail, roleName, setRoleName, handleSubmit } =
    useStaffInvite(onClose, onSuccess);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Invite Staff Member"
      maxWidth="xl"
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitLabel="Send Invitation"
        />
      }
    >
      <Form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Input
            label="Staff Email Address *"
            type="email"
            placeholder="colleague@hospital.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
          />

          <Box>
            <Text size="sm" weight="medium" className="mb-2">
              Assign Hospital Role *
            </Text>
            <RoleSelectorGrid
              selectedRole={roleName}
              onSelectRole={setRoleName}
            />
          </Box>
        </Box>
      </Form>
    </Modal>
  );
};

export default StaffInviteFormModal;
