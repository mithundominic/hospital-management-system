// Responsibility: Render empty state message with optional primary/secondary action buttons

import { type LucideIcon } from 'lucide-react';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) => {
  return (
    <Box className="text-center py-12 px-4">
      <Box className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </Box>
      <Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </Heading>
      <Text className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </Text>
      {(onAction || onSecondaryAction) && (
        <Flex align="center" justify="center" gap={3}>
          {onAction && actionLabel && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {onSecondaryAction && secondaryActionLabel && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default EmptyState;
