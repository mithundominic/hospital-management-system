// Responsibility: Universal reusable card component for record entities in card view
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export interface DataCardField {
  label: string;
  value: ReactNode;
}

export interface DataCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  fields?: DataCardField[];
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export const DataCard = ({
  title,
  subtitle,
  icon,
  badge,
  fields,
  actions,
  onClick,
  className,
  children,
}: DataCardProps) => (
  <Card
    className={cn(
      "p-4 transition-all duration-200 hover:shadow-md border border-gray-200 flex flex-col justify-between",
      onClick && "cursor-pointer hover:border-primary-300",
      className,
    )}
    onClick={onClick}
  >
    <Box>
      <Flex align="start" justify="between" className="gap-2 mb-3">
        <Flex align="center" className="gap-2.5 min-w-0">
          {icon && (
            <Box className="p-2 rounded-lg bg-primary-50 text-primary-600 shrink-0">
              {icon}
            </Box>
          )}
          <Box className="min-w-0">
            <Heading level={3} className="text-base font-semibold text-gray-900 truncate">
              {title}
            </Heading>
            {subtitle && (
              <Text variant="muted" size="xs" className="truncate mt-0.5">
                {subtitle}
              </Text>
            )}
          </Box>
        </Flex>
        {badge && <Box className="shrink-0">{badge}</Box>}
      </Flex>

      {fields && fields.length > 0 && (
        <Box className="space-y-1.5 py-2.5 my-2 border-y border-gray-100">
          {fields.map((f, i) => (
            <Flex key={i} justify="between" align="center" className="gap-2">
              <Text variant="muted" size="xs" className="shrink-0">{f.label}</Text>
              <Box className="text-right font-medium text-xs text-gray-800 truncate">
                {f.value}
              </Box>
            </Flex>
          ))}
        </Box>
      )}

      {children}
    </Box>

    {actions && (
      <Flex align="center" justify="end" className="gap-2 mt-3 pt-2 border-t border-gray-50">
        {actions}
      </Flex>
    )}
  </Card>
);

export default DataCard;
