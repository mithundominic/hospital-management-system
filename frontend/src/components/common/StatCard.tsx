// Responsibility: Reusable metric card rendering a KPI figure, label, and domain icon

import type { ElementType, ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: ReactNode;
  icon: ElementType;
  iconColor?: string;
  valueColor?: string;
  cardPadding?: string;
}

export const StatCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "text-primary-600",
  valueColor,
  cardPadding = "p-6",
}: StatCardProps) => (
  <Card className={cardPadding}>
    <Flex align="center" justify="between">
      <Box>
        <Text size="sm" variant="muted">
          {label}
        </Text>
        <Text size="xl" weight="bold" className={`mt-1 ${valueColor || ""}`}>
          {value}
        </Text>
        {subtext &&
          (typeof subtext === "string" ? (
            <Text size="xs" variant="caption" className="mt-1">
              {subtext}
            </Text>
          ) : (
            <Box className="mt-1">{subtext}</Box>
          ))}
      </Box>
      <Icon className={`h-8 w-8 ${iconColor}`} />
    </Flex>
  </Card>
);

export default StatCard;
