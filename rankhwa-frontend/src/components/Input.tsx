import React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

/**
 * A form input with a label and error message.  It forwards all
 * standard input props and styles itself according to the current
 * theme.  Required inputs display a red border when invalid.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, type = 'text', ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors',
            'bg-card border-border focus:border-primary focus:ring-1 focus:ring-primary',
            error && 'border-error',
            className
          )}
          {...props}
        />
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';