// Responsibility: Primitive image element wrapping raw HTML img tag

import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, fallbackSrc, onError, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt || ""}
        className={cn("object-contain", className)}
        onError={(e) => {
          if (fallbackSrc) {
            e.currentTarget.src = fallbackSrc;
          }
          onError?.(e);
        }}
        {...props}
      />
    );
  },
);

Image.displayName = "Image";
