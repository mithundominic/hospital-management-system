// Responsibility: Modal action footer with cancel and confirm/submit buttons

import type { SyntheticEvent } from "react";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";

export interface ModalFooterProps {
  onCancel: () => void;
  onSubmit?: (e?: SyntheticEvent) => void | Promise<void>;
  cancelLabel?: string;
  submitLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  submitType?: "button" | "submit";
}

export const ModalFooter = ({
  onCancel,
  onSubmit,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  isLoading = false,
  disabled = false,
  submitType = "button",
}: ModalFooterProps) => (
  <Flex justify="end" gap={3}>
    <Button
      variant="secondary"
      onClick={onCancel}
      disabled={disabled || isLoading}
    >
      {cancelLabel}
    </Button>
    <Button
      type={submitType}
      onClick={onSubmit}
      isLoading={isLoading}
      disabled={disabled}
    >
      {submitLabel}
    </Button>
  </Flex>
);

export default ModalFooter;
