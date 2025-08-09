import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { RatingStars } from '@/features/manhwa/RatingStars';
import { RatingControl } from '@/features/manhwa/RatingControl';
import { AddToList } from '@/features/manhwa/AddToList';
import { useAuth } from '@/features/auth/auth.store';
import { plainTextFromHtml } from '@/lib/text';

const ManhwaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const manhwaId = Number(id);
  const { user, token } = useAuth();
  const location = useLocation();
  const detailQuery = useQuery(['manhwa', manhwaId], () => api.getManhwaDetail(manhwaId), {
    enabled: !isNaN(manhwaId),
  });
  const myRatingQuery = useQuery(
    ['myRating', manhwaId],
    () => api.getMyRating(manhwaId),
    {
      enabled: !!token && !isNaN(manhwaId),
    }
  );

  const { data: manhwa, isLoading, error } = detailQuery;
  const myRating = myRatingQuery.data?.score ?? null;

  if (isLoading) {
    return <div className="p-4">Loading…</div>;
  }
  if (error || !manhwa) {
    return <div className="p-4 text-error">Error loading manhwa.</div>;
  }
  const displayTitle = manhwa.titleEnglish || manhwa.titleRomaji || manhwa.titleNative || manhwa.title;
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={manhwa.coverUrl || ''}
          alt={displayTitle}
          className="w-60 h-80 object-cover rounded-md border border-border"
        />
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">{displayTitle}</h1>
            {/* Title hierarchy */}
            {manhwa.titleRomaji && manhwa.titleRomaji !== displayTitle && (
              <p className="text-sm text-muted">{manhwa.titleRomaji}</p>
            )}
            {manhwa.titleNative && manhwa.titleNative !== displayTitle && (
              <p className="text-sm text-muted">{manhwa.titleNative}</p>
            )}
          </div>
          {/* Rating summary */}
          {typeof manhwa.avgRating === 'number' && (
            <div className="flex items-center space-x-2">
              <RatingStars rating={manhwa.avgRating} />
              <span className="text-sm font-medium">{manhwa.avgRating.toFixed(1)}</span>
              {manhwa.voteCount != null && <span className="text-sm">({manhwa.voteCount} votes)</span>}
            </div>
          )}
          {/* Your rating */}
          <div>
            {user ? (
              <>
                <p className="text-sm font-medium mb-1">Your rating</p>
                <RatingControl manhwaId={manhwaId} initialScore={myRating} />
              </>
            ) : (
              <p className="text-sm">
              <a href={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} className="text-primary underline">
                  Log in
                </a>{' '}
                to rate
              </p>
            )}
          </div>
          {/* Add to list */}
          {user && (
            <div>
              <p className="text-sm font-medium mb-1">Add to list</p>
              <AddToList manhwaId={manhwaId} />
            </div>
          )}
          {/* Meta information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {manhwa.author && (
              <div>
                <span className="font-medium">Author:</span> {manhwa.author}
              </div>
            )}
            {manhwa.releaseDate && (
              <div>
                <span className="font-medium">Release:</span> {new Date(manhwa.releaseDate).getFullYear()}
              </div>
            )}
            {manhwa.genres && manhwa.genres.length > 0 && (
              <div className="sm:col-span-2">
                <span className="font-medium">Genres:</span> {manhwa.genres.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      {manhwa.description && (
        <div className="mt-6">
          <p className="leading-relaxed whitespace-pre-line">
          {manhwa.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="leading-relaxed whitespace-pre-wrap">
                {plainTextFromHtml(manhwa.description)}
              </p>
            </div>
          )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManhwaPage;