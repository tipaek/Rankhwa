import { useQueries } from '@tanstack/react-query';
import { getManhwaDetail, ManhwaDetail } from '@/lib/api';

/**
 * Fetch multiple manhwa details in parallel.  Returns an array
 * containing the resolved detail for each id or undefined if not yet
 * fetched.  Consumers should check for undefined values before
 * dereferencing the results.
 */
export function useManhwaDetails(ids: number[]) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['manhwa', id],
      queryFn: () => getManhwaDetail(id),
    })),
  });
  return queries.map((q) => q.data as ManhwaDetail | undefined);
}