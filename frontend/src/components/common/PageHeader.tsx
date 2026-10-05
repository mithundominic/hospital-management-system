// Responsibility: Common page header layout displaying title, description, and action controls

import type { ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  action,
  children,
  className,
}: PageHeaderProps) => (
  <Flex
    align="center"
    justify="between"
    className={cn("gap-4 flex-wrap sm:flex-nowrap", className)}
  >
    <Box className="shrink-0">
      <Heading level={1} className="text-2xl font-bold text-gray-900">
        {title}
      </Heading>
      {description && <Text variant="muted">{description}</Text>}
    </Box>
    {children && <Box className="flex-1 max-w-lg mx-2">{children}</Box>}
    {action && <Box className="shrink-0">{action}</Box>}
  </Flex>
);

export default PageHeader;
