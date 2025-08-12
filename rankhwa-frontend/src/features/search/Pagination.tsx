import React from 'react';
import { useSearchQueryParams } from './useSearchParams';
import { Button } from '@/components/Button';

/**
 * Controls to paginate through search results.  It reads the page
 * number and size from the URL and writes updates back via
 * useSearchQueryParams().  Note that the backend does not return
 * total counts, so this component simply allows next/previous
 * navigation without knowing the last page.
 */
export const Pagination: React.FC<{ currentCount?: number }> = ({ currentCount = 0 }) => {
  const { params, setParam } = useSearchQueryParams();
  const page = params.page ?? 0;
  const size = params.size ?? 20;

  const go = (nextPage: number, dir: 'next' | 'prev') => {
    try { sessionStorage.setItem('navDir', dir); } catch {}
    setParam('page', nextPage);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 0}
        onClick={() => go(page - 1, 'prev')}
      >
        Previous
      </Button>
      <span className="text-sm">Page {page + 1}</span>
      <Button
        variant="secondary"
        size="sm"
        disabled={currentCount < size}
        onClick={() => go(page + 1, 'next')}
      >
        Next
      </Button>
    </div>
  );
};