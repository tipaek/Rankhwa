import React from 'react';
import { ManhwaSummary } from '@/lib/api';
import { ManhwaCard } from './ManhwaCard';

interface ManhwaGridProps {
  items: ManhwaSummary[];
}

/**
 * Displays a responsive grid of manhwa cards.  It adapts the number
 * of columns based on the viewport size.
 */
export const ManhwaGrid: React.FC<ManhwaGridProps> = ({ items }) => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <ManhwaCard key={item.id} manhwa={item} />
      ))}
    </div>
  );
};