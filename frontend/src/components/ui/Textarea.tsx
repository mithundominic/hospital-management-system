// Responsibility: Primitive textarea component wrapping raw HTML textarea element

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, id, required, rows = 3, className, ...props },
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
        <textarea
          ref={ref}
          id={id}
          required={required}
          rows={rows}
          className={cn(
            "block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50",
            error &&
              "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500",
            className,
          )}
          {...props}
        />
      </FormField>
    );
  },
);

Textarea.displayName = "Textarea";
