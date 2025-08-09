import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0–10
}

/**
 * Display up to five stars based on a 0–10 rating.  Each star
 * corresponds to two points.  Fractional parts are rounded to the
 * nearest half-star by simple rounding (no half star icon is shown).
 */
export const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const normalized = Math.max(0, Math.min(10, rating));
  const stars = Math.round(normalized / 2);
  return (
    <div className="flex items-center space-x-0.5" aria-label={`Rating ${rating}/10`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={i <= stars ? 'w-4 h-4 text-yellow-400' : 'w-4 h-4 text-muted'}
        />
      ))}
    </div>
  );
};