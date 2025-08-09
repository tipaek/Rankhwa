import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useManhwaDetails } from '@/features/manhwa/useManhwaDetails';
import { removeItemFromList } from '@/lib/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Trash2 } from 'lucide-react';
import { RatingStars } from '@/features/manhwa/RatingStars';
import { useToast } from '@/components/Toast';
import { Link } from 'react-router-dom';

interface ManhwaCardListProps {
  listId: number;
  manhwaIds: number[];
}

/**
 * Displays a list of manhwa within a specific user list.  Allows
 * removing items via a trash button overlay.
 */
export const ManhwaCardList: React.FC<ManhwaCardListProps> = ({ listId, manhwaIds }) => {
  const details = useManhwaDetails(manhwaIds);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const removeMutation = useMutation(
    async (manhwaId: number) => {
      await removeItemFromList(listId, manhwaId);
      return manhwaId;
    },
    {
      onSuccess: (manhwaId) => {
        queryClient.invalidateQueries(['list', listId]);
        toast({ title: 'Removed', description: 'Removed from list', variant: 'success' });
      },
      onError: (err: any) => {
        toast({ title: 'Error', description: err.message || 'Failed to remove', variant: 'error' });
      },
    }
  );
  if (manhwaIds.length === 0) {
    return <p className="text-muted">This list is empty.</p>;
  }
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {details.map((detail, idx) => {
        const id = manhwaIds[idx];
        if (!detail) {
          return (
            <Card key={id} className="p-4 flex items-center justify-center">
              Loading…
            </Card>
          );
        }
        const displayTitle = detail.titleEnglish || detail.titleRomaji || detail.titleNative || detail.title;
        return (
          <Card key={id} className="relative group">
            <Link to={`/manhwa/${id}`} className="block overflow-hidden">
              <img src={detail.coverUrl || ''} alt={displayTitle} className="w-full h-80 object-cover transition-transform group-hover:scale-105" />
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{displayTitle}</h3>
                {typeof detail.avgRating === 'number' && (
                  <div className="flex items-center space-x-1 text-xs text-muted">
                    <RatingStars rating={detail.avgRating} />
                    <span>{detail.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeMutation.mutate(id)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1"
              aria-label="Remove from list"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        );
      })}
    </div>
  );
};