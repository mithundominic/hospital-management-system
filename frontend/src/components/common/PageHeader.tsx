// Responsibility: Common page header layout displaying title, description, and action controls

import type { ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <Flex align="center" justify="between">
    <Box>
      <Heading level={1} className="text-2xl font-bold text-gray-900">
        {title}
      </Heading>
      {description && <Text variant="muted">{description}</Text>}
    </Box>
    {action && <Box>{action}</Box>}
  </Flex>
);

export default PageHeader;
