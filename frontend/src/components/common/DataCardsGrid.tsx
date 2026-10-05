// Responsibility: Render responsive grid of cards within fixed scrollable container
import type { ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { cn } from "@/lib/utils";

export interface DataCardsGridProps<T> {
  data: T[];
  renderCard: (item: T, index: number) => ReactNode;
  cols?: 1 | 2 | 3 | 4;
  containerClassName?: string;
}

export function DataCardsGrid<T>({
  data,
  renderCard,
  cols = 3,
  containerClassName,
}: DataCardsGridProps<T>) {
  return (
    <Box className={cn("max-h-[520px] overflow-auto p-4", containerClassName)}>
      <Grid cols={cols} gap={4}>
        {data.map((item, index) => renderCard(item, index))}
      </Grid>
    </Box>
  );
}

export default DataCardsGrid;
