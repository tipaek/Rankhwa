import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchQueryParams } from './useSearchParams';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { cn } from '@/lib/cn';

const genresList = [
  'Action','Adventure','Comedy','Drama','Fantasy','Mystery','Psychological',
  'Romance','Sci-Fi','Slice of Life','Supernatural','Thriller'
];



export const SearchBar: React.FC = () => {
  const { params, setParam } = useSearchQueryParams();
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState(params.query ?? '');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setParam('query', queryInput.trim()), 300);
    return () => clearTimeout(t);
  }, [queryInput, setParam]);

  // Genres (multi)
  const selectedGenres = params.genres ? params.genres.split(',').filter(Boolean) : [];
  const toggleGenre = (g: string) => {
    const next = selectedGenres.includes(g)
      ? selectedGenres.filter(x => x !== g)
      : [...selectedGenres, g];
    setParam('genres', next.length ? next.join(',') : undefined);
  };
  const clearGenres = () => setParam('genres', undefined);

  // Dropdown plumbing
  const [genresOpen, setGenresOpen] = useState(false);
  const genresRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!genresRef.current?.contains(e.target as Node)) setGenresOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const ratingOptions = Array.from({ length: 10 }, (_, i) => 10 - i); // 10..1

  // Mobile Toggle
  const activeCount =
  (params.genres ? 1 : 0) +
  (params.year ? 1 : 0) +
  (params.min_rating ? 1 : 0) +
  (params.min_votes ? 1 : 0) +
  (params.sort && params.sort !== 'rating' ? 1 : 0);

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex-1">
          <Input
            id="search"
            label="Search"
            placeholder="Title…"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="primary" onClick={() => navigate('/search' + window.location.search)}>
            Search
          </Button>
        </div>
      </div>

      {/* Mobile filters toggle */}
      <div className="flex md:hidden justify-between items-center">
        <button
          type="button"
          className="text-sm px-3 py-2 rounded-md border border-border bg-card"
          onClick={() =>
            setFiltersOpen(o => {
              const next = !o;
              if (!next) setGenresOpen(false); // close dropdown when collapsing
              return next;
            })
          }
          aria-expanded={filtersOpen}
          aria-controls="filters-panel"
        >
          Filters{activeCount ? ` (${activeCount})` : ''}
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            className="text-sm underline"
            onClick={() => {
              clearGenres();
              setParam('year', undefined);
              setParam('min_rating', undefined);
              setParam('min_votes', undefined);
              setParam('sort', 'rating');
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className={cn(
          "mt-2 gap-4",
          // when CLOSED: hidden on mobile, grid on md+ with proper cols
          !filtersOpen && "hidden md:grid md:grid-cols-3 xl:grid-cols-6",
          // when OPEN: grid across breakpoints with full col spec
          filtersOpen && "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
        )}>
        {/* Genres dropdown */}
        <div ref={genresRef} className="relative">
          <label className="block text-sm font-medium mb-1">Genres</label>
          <button
            type="button"
            className="w-full h-10 bg-card border border-border rounded-md px-3 text-sm flex items-center justify-between"
            onClick={() => setGenresOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={genresOpen}
          >
            <span className="truncate">
              {selectedGenres.length === 0 ? 'Any' : selectedGenres.join(', ')}
            </span>
            <span className="ml-2 text-xs opacity-70">{genresOpen ? '▲' : '▼'}</span>
          </button>

          {genresOpen && (
            <div
              role="listbox"
              tabIndex={-1}
              onKeyDown={(e) => e.key === 'Escape' && setGenresOpen(false)}
              className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-64 overflow-auto"
            >
              {/* Any */}
              <button
                type="button"
                className={cn(
                  'w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-muted',
                  selectedGenres.length === 0 && 'bg-muted'
                )}
                onClick={() => { clearGenres(); setGenresOpen(false); }}
              >
                <span>Any</span>
                {selectedGenres.length === 0 && <span aria-hidden>✓</span>}
              </button>

              <div className="border-t border-border my-1" />

              {genresList.map((g) => {
                const checked = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-muted',
                      checked && 'bg-muted/70'
                    )}
                    onClick={() => toggleGenre(g)}
                  >
                    <span className="capitalize">{g}</span>
                    {checked && <span aria-hidden>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            className="w-full h-10 bg-card border border-border rounded-md px-3 text-sm"
            value={params.year ?? ''}
            onChange={(e) => setParam('year', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Any</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Min rating (dropdown 10 -> 1) */}
        <div>
          <label className="block text-sm font-medium mb-1">Min rating</label>
          <select
            className="w-full h-10 bg-card border border-border rounded-md px-3 text-sm"
            value={params.min_rating ?? ''}
            onChange={(e) => setParam('min_rating', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Any</option>
            {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Min votes (no steppers) */}
        <div>
          <label className="block text-sm font-medium mb-1">Min votes</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={10}
            value={params.min_votes ?? ''}
            onChange={(e) => setParam('min_votes', e.target.value ? Number(e.target.value) : undefined)}
            className={cn(
              'w-full h-10 bg-card border border-border rounded-md px-3 text-sm',
              'appearance-none [-moz-appearance:textfield]',
              '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
            placeholder="Any"
          />
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-sm font-medium mb-1">Sort by</label>
          <select
            className="w-full h-10 bg-card border border-border rounded-md px-3 text-sm"
            value={params.sort ?? 'rating'}
            onChange={(e) => setParam('sort', e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Page size */}
        <div>
          <label className="block text-sm font-medium mb-1">Page size</label>
          <select
            className="w-full h-10 bg-card border border-border rounded-md px-3 text-sm"
            value={params.size ?? 20}
            onChange={(e) => setParam('size', Number(e.target.value))}
          >
            {[20, 40, 80, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
