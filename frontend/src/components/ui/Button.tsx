// Responsibility: Primitive button component wrapping raw HTML button element

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 shadow-sm focus:ring-primary-500",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost:
    "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400",
  outline:
    "border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className={cn("inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin", children && "mr-2")} />
        ) : icon ? (
          <span className={cn("inline-flex items-center", children && "mr-2")}>{icon}</span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
