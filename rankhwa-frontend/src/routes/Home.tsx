import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getManhwaList } from '@/lib/api';
import { SearchBar } from '@/features/search/SearchBar';
import { ManhwaCarousel } from '@/features/manhwa/ManhwaCarousel';
import { SpotlightCarousel } from '@/features/manhwa/SpotlightCarousel';

// Home stays on "/" while filters update (SearchBar uses the hook which now preserves the current path)
const HomePage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const trending = useQuery(['trending'], () =>
    getManhwaList({ sort: 'rating', min_votes: 1000, size: 10 })
  );

  const popularYear = useQuery(
    ['popular-year', year],
    () => getManhwaList({ year, sort: 'rating', min_votes: 200, size: 10 }),
    { keepPreviousData: true }
  );

  const popularAll = useQuery(['popular-all'], () =>
    getManhwaList({ sort: 'rating', min_votes: 50, size: 10 })
  );

  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-7xl mx-auto p-4">

      {/* Global search bar (now won’t kick you to /search automatically) */}
      <SearchBar />

      {/* Trending */}
      {trending.data && trending.data.length > 0 && (
        <SpotlightCarousel title="Trending" items={trending.data} />
      )}

      {/* Popular This Year */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Popular {year}</h2>
        <select
          className="bg-card border border-border rounded-md px-2 py-1 text-sm"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {popularYear.data && popularYear.data.length > 0 && (
        <ManhwaCarousel title="" items={popularYear.data} />
      )}

      {/* All Time Popular */}
      {popularAll.data && popularAll.data.length > 0 && (
        <ManhwaCarousel title="All-Time Popular" items={popularAll.data} />
      )}
    </div>
  );
};

export default HomePage;
