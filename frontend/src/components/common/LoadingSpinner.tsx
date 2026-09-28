// Responsibility: Render loading spinner with customizable size and full-screen overlay option

import { Box } from "@/components/ui/Box";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-12 w-12",
  lg: "h-16 w-16",
} as const;

export const LoadingSpinner = ({
  size = "md",
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const spinner = (
    <Box
      className={cn(
        "animate-spin rounded-full border-b-2 border-primary-600",
        sizeClasses[size],
      )}
    />
  );

  if (fullScreen) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        {spinner}
      </Box>
    );
  }

  return spinner;
};

export default LoadingSpinner;
