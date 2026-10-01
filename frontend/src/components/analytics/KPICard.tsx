// Responsibility: Analytics KPI card with trend indicator

import type { ElementType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";

export interface KPICardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: ElementType;
}

export const KPICard = ({ label, value, trend, icon: Icon }: KPICardProps) => {
  const trendColor =
    trend && trend > 0
      ? "text-green-600"
      : trend && trend < 0
        ? "text-red-600"
        : "";
  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <Card className="p-6">
      <Flex align="center" justify="between">
        <Box>
          <Text size="sm" variant="muted">
            {label}
          </Text>
          <Text size="xl" weight="bold" className="mt-1">
            {value}
          </Text>
          {trend !== undefined && trend !== 0 && (
            <Flex align="center" gap={1} className="mt-1">
              <TrendIcon className={`h-3 w-3 ${trendColor}`} />
              <Text size="xs" className={trendColor}>
                {Math.abs(trend)}%
              </Text>
            </Flex>
          )}
        </Box>
        <Icon className="h-8 w-8 text-primary-600" />
      </Flex>
    </Card>
  );
};
