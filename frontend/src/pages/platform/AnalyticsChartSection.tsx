// Responsibility: Render analytics chart section with loading state

import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { ComponentType } from "react";

interface AnalyticsChartSectionProps<T> {
  title: string;
  data: T;
  isLoading: boolean;
  ChartComponent: ComponentType<{ data: T }>;
}

export const AnalyticsChartSection = <T,>({
  title,
  data,
  isLoading,
  ChartComponent,
}: AnalyticsChartSectionProps<T>) => {
  return (
    <Box className="p-6 bg-white rounded-lg shadow">
      <Heading level={3} className="text-lg font-semibold mb-4">
        {title}
      </Heading>
      {isLoading ? <LoadingSpinner /> : <ChartComponent data={data} />}
    </Box>
  );
};
