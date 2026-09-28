// Responsibility: Primitive form component wrapping raw HTML form element

import { forwardRef, type FormHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => (
    <form ref={ref} className={cn(className)} {...props}>
      {children}
    </form>
  ),
);

Form.displayName = "Form";
