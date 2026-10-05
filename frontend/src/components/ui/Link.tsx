// Responsibility: Primitive link component wrapping raw HTML anchor tag

import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a ref={ref} className={cn(className)} {...props}>
        {children}
      </a>
    );
  },
);

Link.displayName = "Link";
