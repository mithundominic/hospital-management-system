// Responsibility: Render list and timeline skeleton placeholder loaders

import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";

export interface SkeletonListProps {
  items?: number;
}

export const SkeletonList = ({ items = 5 }: SkeletonListProps) => {
  return (
    <Box className="space-y-4 animate-pulse">
      {Array.from({ length: items }).map((_, index) => (
        <Box key={index} className="p-4 border border-gray-200 rounded-lg">
          <Flex align="start" gap={4}>
            <Box className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0" />
            <Box className="flex-1 space-y-2">
              <Box className="h-5 bg-gray-200 rounded w-1/3" />
              <Box className="h-4 bg-gray-200 rounded w-2/3" />
              <Box className="h-4 bg-gray-200 rounded w-1/2" />
            </Box>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};

export const SkeletonTimelineItem = () => {
  return (
    <Flex gap={4} className="animate-pulse">
      <Flex direction="col" align="center">
        <Box className="h-10 w-10 bg-gray-200 rounded-full" />
        <Box className="w-0.5 h-full bg-gray-200 mt-2" />
      </Flex>
      <Box className="flex-1 pb-8">
        <Box className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
        <Box className="p-4 border border-gray-200 rounded-lg space-y-2">
          <Box className="h-4 bg-gray-200 rounded w-3/4" />
          <Box className="h-4 bg-gray-200 rounded w-1/2" />
          <Box className="h-4 bg-gray-200 rounded w-2/3" />
        </Box>
      </Box>
    </Flex>
  );
};

export default SkeletonList;
