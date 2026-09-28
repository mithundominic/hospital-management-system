// Responsibility: Modal confirmation dialog for destructive or critical actions

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    iconColor: "text-red-600",
    bg: "bg-red-100",
    btnVariant: "danger" as const,
  },
  warning: {
    iconColor: "text-yellow-600",
    bg: "bg-yellow-100",
    btnVariant: "primary" as const,
  },
  info: {
    iconColor: "text-blue-600",
    bg: "bg-blue-100",
    btnVariant: "primary" as const,
  },
} as const;

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) => {
  const config = variantConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <Flex gap={3} className="w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.btnVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </Flex>
      }
    >
      <Box className="text-center py-2">
        <Box
          className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${config.bg}`}
        >
          <AlertTriangle className={`h-6 w-6 ${config.iconColor}`} />
        </Box>
        <Text variant="muted" size="sm" className="text-center">
          {message}
        </Text>
      </Box>
    </Modal>
  );
};
