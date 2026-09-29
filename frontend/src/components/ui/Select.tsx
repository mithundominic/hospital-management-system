// Responsibility: Primitive select component wrapping raw HTML select and option elements

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: readonly SelectOption[] | SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      id,
      required,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <FormField
        id={id}
        label={label}
        error={error}
        helperText={helperText}
        required={required}
      >
        <select
          ref={ref}
          id={id}
          required={required}
          className={cn(
            "block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50",
            error &&
              "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500",
            className,
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </FormField>
    );
  },
);

Select.displayName = "Select";
