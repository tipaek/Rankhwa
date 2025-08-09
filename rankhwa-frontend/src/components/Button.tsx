import React from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A styled button component supporting several variants and sizes.  It
 * forwards standard button attributes and disables itself when
 * `disabled` is true.  The button uses Tailwind utility classes
 * defined via CSS variables for consistent theming.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const sizes: Record<typeof size, string> = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-3 text-base',
    };
    const variants: Record<typeof variant, string> = {
      primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/60',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 disabled:bg-secondary/60',
      ghost: 'bg-transparent text-primary hover:bg-primary/10 disabled:text-primary/50',
      destructive: 'bg-error text-white hover:bg-error/90 disabled:bg-error/60',
    };
    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, sizes[size], variants[variant], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';