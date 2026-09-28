// Responsibility: Primitive text component wrapping raw p, span, and label elements

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  as?: 'p' | 'span' | 'label' | 'div';
  variant?: 'body' | 'caption' | 'muted' | 'error' | 'label';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

const variantStyles = {
  body: 'text-gray-900',
  caption: 'text-gray-500 text-xs',
  muted: 'text-gray-500',
  error: 'text-red-600 text-xs',
  label: 'text-sm font-medium text-gray-700',
} as const;

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

const sizeStyles = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const;

export const Text = ({
  as: Component = 'p',
  variant = 'body',
  weight,
  size,
  htmlFor,
  className,
  children,
}: TextProps) => {
  return (
    <Component
      htmlFor={Component === 'label' ? htmlFor : undefined}
      className={cn(
        variantStyles[variant],
        weight && weightStyles[weight],
        size && sizeStyles[size],
        className
      )}
    >
      {children}
    </Component>
  );
};
