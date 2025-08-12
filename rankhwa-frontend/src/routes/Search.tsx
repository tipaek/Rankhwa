import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/features/search/SearchBar';
import { useSearchQueryParams } from '@/features/search/useSearchParams';
import { getManhwaList } from '@/lib/api';
import { ManhwaGrid } from '@/features/manhwa/ManhwaGrid';
import { Pagination } from '@/features/search/Pagination';

const SearchPage: React.FC = () => {
  const { params } = useSearchQueryParams();
  const { page = 0 } = params;


  // The query key should include all filter params to ensure
  // independent caches per filter combination.
  const queryKey = React.useMemo(() => ['search', params], [params]);
  const { data, isFetching, error } = useQuery(queryKey, () => getManhwaList(params), {
    keepPreviousData: true,
  });

  // Scroll after data for the target page is on screen
  React.useEffect(() => {
    if (!data) return;
    let dir: 'next' | 'prev' | null = null;
    try { dir = (sessionStorage.getItem('navDir') as any) ?? null; } catch {}
    if (!dir) return;

    // Clear the flag immediately so we don’t misfire on future renders
    try { sessionStorage.removeItem('navDir'); } catch {}

    const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const toBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

    if (dir === 'next') toTop();
    else toBottom();
  }, [page, data]); // run when page changes AND new data arrives

  return (
    <div className="max-w-7xl mx-auto p-4">
      <SearchBar />
      {error && (
        <div className="mt-4 text-error">{(error as Error).message || 'An error occurred'}</div>
      )}
      {isFetching && !data ? (
        <div className="mt-8 text-muted">Loading…</div>
      ) : data && data.length > 0 ? (
        <>
          <div className="mt-6">
            <ManhwaGrid items={data} />
          </div>
          <Pagination currentCount={data.length}/>
        </>
      ) : (
        <div className="mt-8 text-muted">No results found.</div>
      )}
    </div>
  );
};

export default SearchPage;