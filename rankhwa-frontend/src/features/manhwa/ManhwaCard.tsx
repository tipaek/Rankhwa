import React from 'react';
import { Link } from 'react-router-dom';
import { ManhwaSummary } from '@/lib/api';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { RatingStars } from './RatingStars';
import { AddToList } from './AddToList';
import { useAuth } from '@/features/auth/auth.store';

interface ManhwaCardProps {
  manhwa: ManhwaSummary;
}

const placeholder =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" fill="%23' +
  'e5e7eb' +
  '"><rect width="200" height="300"/></svg>';

/**
 * Card representation of a manhwa summary.  It displays the cover,
 * title, genres, average rating and optionally an Add‑to‑list
 * control for authenticated users.
 */
export const ManhwaCard: React.FC<ManhwaCardProps> = ({ manhwa }) => {
  const { user } = useAuth();
  const displayTitle = manhwa.titleEnglish || manhwa.titleRomaji || manhwa.titleNative || manhwa.title;
  return (
    <Card className="overflow-hidden relative group">
      <Link to={`/manhwa/${manhwa.id}`} className="block">
        <img
          src={manhwa.coverUrl || placeholder}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-80 object-cover transition-transform group-hover:scale-105"
        />
      </Link>
      {/* Add to List button */}
      {user && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToList manhwaId={manhwa.id} />
        </div>
      )}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem]">{displayTitle}</h3>
        {manhwa.genres && manhwa.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {manhwa.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="capitalize">
                {genre}
              </Badge>
            ))}
          </div>
        )}
        {typeof manhwa.avgRating === 'number' && (
          <div className="flex items-center space-x-2 text-xs text-muted">
            <RatingStars rating={manhwa.avgRating} />
            <span className="font-medium">{manhwa.avgRating.toFixed(1)}</span>
            {manhwa.voteCount != null && <span>({manhwa.voteCount})</span>}
          </div>
        )}
      </div>
    </Card>
  );
};