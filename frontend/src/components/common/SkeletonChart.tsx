// Responsibility: Render chart skeleton placeholder loaders for bar and pie charts

import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { cn } from '@/lib/utils';

export interface SkeletonChartProps {
  height?: string;
}

export const SkeletonChart = ({ height = 'h-64' }: SkeletonChartProps) => {
  return (
    <Flex
      align="end"
      justify="around"
      gap={2}
      className={cn(height, 'bg-gray-50 rounded-lg animate-pulse p-4')}
    >
      {[45, 75, 55, 80, 60, 90, 70].map((h, index) => (
        <Box
          key={index}
          className="bg-gray-200 rounded w-full"
          style={{ height: `${h}%` }}
        />
      ))}
    </Flex>
  );
};

export const SkeletonPieChart = () => {
  return (
    <Flex align="center" justify="center" className="h-64 animate-pulse">
      <Box className="h-48 w-48 bg-gray-200 rounded-full" />
    </Flex>
  );
};

export default SkeletonChart;
