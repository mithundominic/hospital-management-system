// Responsibility: Reusable section and info-row components for tenant details modal

import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box className="space-y-2">
    <Text className="font-medium text-sm text-gray-600">{title}</Text>
    <Box className="space-y-1">{children}</Box>
  </Box>
);

export const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <Flex className="justify-between text-sm">
    <Text className="text-gray-600">{label}:</Text>
    <Text className="font-medium">{value || "—"}</Text>
  </Flex>
);
