// Responsibility: Atomic UI wrapper providing accessible label, error message, and helper text

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export const FormField = ({
  id,
  label,
  error,
  helperText,
  required,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn("w-full", className)}>
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    {!error && helperText && (
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
    )}
  </div>
);

export default FormField;
