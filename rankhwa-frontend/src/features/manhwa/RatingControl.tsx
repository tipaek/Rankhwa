import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRating } from '@/lib/api';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

interface RatingControlProps {
  manhwaId: number;
  initialScore: number | null;
}

/**
 * Allows an authenticated user to rate a manhwa from 1–10.  The
 * control renders a horizontal list of numbers.  Selecting a
 * different score triggers a mutation with optimistic UI.  If the
 * user has not rated before the current selection is null.
 */
export const RatingControl: React.FC<RatingControlProps> = ({ manhwaId, initialScore }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [score, setScore] = React.useState<number | null>(initialScore);
  const mutation = useMutation(
    async (newScore: number) => {
      await postRating(manhwaId, newScore);
      return newScore;
    },
    {
      onMutate: async (newScore) => {
        setScore(newScore);
      },
      onSuccess: () => {
        toast({ title: 'Rating saved', variant: 'success' });
        // Invalidate manhwa detail to refresh average rating.
        queryClient.invalidateQueries(['manhwa', manhwaId]);
        queryClient.invalidateQueries(['myRating', manhwaId]);
      },
      onError: (err: any, newScore, context) => {
        toast({ title: 'Error', description: err.message || 'Failed to save rating', variant: 'error' });
      },
    }
  );
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
        const selected = score === n;
        return (
          <Button
            key={n}
            size="sm"
            variant={selected ? 'primary' : 'ghost'}
            className="w-8 h-8 p-0"
            onClick={() => {
              mutation.mutate(n);
            }}
          >
            {n}
          </Button>
        );
      })}
    </div>
  );
};