import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A container that provides a consistent background, border and
 * rounding for content.  Use this instead of bare divs to ensure
 * visual consistency across the app.
 */
export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return <div className={cn('bg-card border border-border rounded-lg shadow-sm', className)} {...props} />;
};