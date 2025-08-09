import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to intelligently merge Tailwind class names.  It combines
 * conditional classes via clsx and then resolves conflicts via
 * tailwind-merge.  This helper is used throughout the UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}