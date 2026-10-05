// Responsibility: Primitive radio button group component wrapping raw HTML input[type="radio"]

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, className }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="cursor-pointer"
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  ),
);

RadioGroup.displayName = "RadioGroup";
