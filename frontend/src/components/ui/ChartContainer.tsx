// Responsibility: Primitive chart container wrapping raw HTML div with fixed height

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  height?: string;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, height = "h-80", children, ...props }, ref) => (
    <div ref={ref} className={cn(height, className)} {...props}>
      {children}
    </div>
  ),
);

ChartContainer.displayName = "ChartContainer";
