// Responsibility: Render card and stat-card skeleton placeholder loaders

import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Card } from "@/components/ui/Card";

export interface SkeletonCardProps {
  rows?: number;
}

export const SkeletonCard = ({ rows = 2 }: SkeletonCardProps) => {
  return (
    <Card className="animate-pulse p-4">
      <Box className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Box key={index}>
            <Box className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <Box className="h-8 bg-gray-200 rounded" />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export const SkeletonStatCard = () => {
  return (
    <Card className="animate-pulse p-4">
      <Flex align="center" justify="between">
        <Box className="flex-1">
          <Box className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <Box className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
          <Box className="h-3 bg-gray-200 rounded w-1/3" />
        </Box>
        <Box className="h-12 w-12 bg-gray-200 rounded-full" />
      </Flex>
    </Card>
  );
};

export default SkeletonCard;
