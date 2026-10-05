// Responsibility: Alert/notification box primitive

import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  danger: "bg-red-50 border-red-200 text-red-800",
} as const;

export const Alert = ({
  variant = "info",
  children,
  className,
}: AlertProps) => {
  return (
    <div
      className={cn(
        "p-4 border rounded-md text-sm",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  );
};
