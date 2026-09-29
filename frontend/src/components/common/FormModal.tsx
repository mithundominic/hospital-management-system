// Responsibility: Standardized dialog shell binding Modal, Form, and ModalFooter for create and edit operations

import type { FormEvent, ReactNode, SyntheticEvent } from "react";
import { Modal, type ModalProps } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { ModalFooter } from "./ModalFooter";

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  isLoading?: boolean;
  maxWidth?: ModalProps["maxWidth"];
  children: ReactNode;
}

export const FormModal = ({
  isOpen = true,
  onClose,
  title,
  description,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting,
  isLoading,
  maxWidth = "xl",
  children,
}: FormModalProps) => {
  const loading = isSubmitting ?? isLoading ?? false;

  const handleFooterSubmit = (e?: SyntheticEvent) => {
    const event = (e ?? { preventDefault: () => {} }) as FormEvent;
    onSubmit(event);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleFooterSubmit}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          isLoading={loading}
        />
      }
    >
      <Form onSubmit={onSubmit}>
        {description && (
          <Text size="sm" variant="muted" className="mb-4">
            {description}
          </Text>
        )}
        <Box className="space-y-4">{children}</Box>
      </Form>
    </Modal>
  );
};

export default FormModal;
