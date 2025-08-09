import React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}

/**
 * A small pill used to display counts, ratings or category tags.
 */
export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className, ...props }) => {
  const variants: Record<typeof variant, string> = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-black',
    error: 'bg-error text-white',
    outline: 'border border-border text-foreground',
  };
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}
      {...props}
    />
  );
};