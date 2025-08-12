import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { SearchParams } from '@/lib/api';

const defaultParams: Partial<SearchParams> = {
  query: '',
  page: 0,
  size: 20,
  sort: 'rating',
};

/**
 * Parse/search helpers that keep you on the current route by default.
 * Pass a basePath to force navigation to a specific route if desired.
 */
export function useSearchQueryParams(basePath?: string) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const params: Partial<SearchParams> = useMemo(() => {
    const obj: Partial<SearchParams> = { ...defaultParams };
    searchParams.forEach((value, key) => {
      if (value === '') return;
      if (key === 'page' || key === 'size' || key === 'min_votes' || key === 'year') {
        obj[key as keyof SearchParams] = Number(value);
      } else if (key === 'min_rating') {
        obj[key] = Number(value);
      } else if (key === 'genres') {
        obj[key] = value;
      } else if (key === 'sort') {
        obj[key] = value as any;
      } else if (key === 'query') {
        obj.query = value;
      }
    });
    return obj;
  }, [searchParams]);

  const setParam = useCallback(
    (key: keyof SearchParams, value: any) => {
      const newParams = new URLSearchParams(searchParams.toString());

      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (typeof value === 'number' && Number.isNaN(value));

        const nextVal = isEmpty ? null : String(value);
        const prevVal = searchParams.get(key as string);
  
        // If nothing actually changes, bail early (prevents pointless resets)
        if ((nextVal ?? '') === (prevVal ?? '')) return;
  
        if (isEmpty) newParams.delete(key as string);
        else newParams.set(key as string, nextVal);
  
        // Only reset page if we actually changed *something* other than page
        if (key !== 'page') newParams.set('page', '0');

      const pathname = basePath ?? location.pathname; // stay on current route by default
      navigate({ pathname, search: newParams.toString() }, { replace: true });
    },
    [basePath, location.pathname, navigate, searchParams]
  );

  return { params, setParam };
}
