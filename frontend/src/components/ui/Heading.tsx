// Responsibility: Primitive heading component wrapping raw HTML heading elements

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
}

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

const levelStyles = {
  1: "text-2xl font-bold text-gray-900",
  2: "text-xl font-bold text-gray-900",
  3: "text-lg font-semibold text-gray-900",
  4: "text-base font-semibold text-gray-900",
  5: "text-sm font-semibold text-gray-900",
  6: "text-xs font-semibold text-gray-900",
} as const;

export const Heading = ({ level = 1, className, children }: HeadingProps) => {
  const Component = headingTags[level];

  return (
    <Component className={cn(levelStyles[level], className)}>
      {children}
    </Component>
  );
};
