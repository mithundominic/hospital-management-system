// Responsibility: Container card with standardized icon header, optional action, and body content

import type { ElementType, ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export interface SectionCardProps {
  title: string;
  icon?: ElementType;
  iconColor?: string;
  action?: ReactNode;
  emptyText?: string;
  className?: string;
  children?: ReactNode;
}

export const SectionCard = ({
  title,
  icon: Icon,
  iconColor = "text-primary-600",
  action,
  emptyText,
  className = "p-6",
  children,
}: SectionCardProps) => (
  <Card className={className}>
    <Flex align="center" justify="between" className="mb-4">
      <Flex align="center" gap={2}>
        {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        <Heading level={3} className="text-lg font-semibold text-gray-900">
          {title}
        </Heading>
      </Flex>
      {action && <Box>{action}</Box>}
    </Flex>
    {children ||
      (emptyText && (
        <Text size="sm" variant="muted">
          {emptyText}
        </Text>
      ))}
  </Card>
);

export default SectionCard;
