import React, { useRef } from 'react';
import { ManhwaSummary } from '@/lib/api';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { RatingStars } from './RatingStars';

export const SpotlightCarousel: React.FC<{ items: ManhwaSummary[]; title?: string }> = ({ items, title = 'Trending' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const by = () => (ref.current ? ref.current.clientWidth * 0.8 : 0);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-3 px-1">{title}</h2>
      <div className="relative">
        <div ref={ref} className="flex overflow-x-auto space-x-4 pb-2 snap-x">
          {items.map((m) => {
            const displayTitle = m.titleEnglish || m.titleRomaji || m.titleNative || m.title;
            return (
              <Link
                key={m.id}
                to={`/manhwa/${m.id}`}
                className="snap-start relative min-w-[85%] sm:min-w-[70%] lg:min-w-[55%] h-[280px] sm:h-[450px] overflow-hidden rounded-xl border border-border"
              >
                <img src={m.coverUrl || ''} alt={displayTitle}
                     className="absolute inset-0 w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute left-5 bottom-5 right-5">
                  <h3 className="text-xl sm:text-2xl font-semibold leading-tight">{displayTitle}</h3>
                  {typeof m.avgRating === 'number' && (
                    <div className="mt-2 flex items-center space-x-2 text-sm">
                      <RatingStars rating={m.avgRating} />
                      <span className="font-medium">{m.avgRating.toFixed(1)}</span>
                      {m.voteCount != null && <span className="opacity-80">({m.voteCount})</span>}
                    </div>
                  )}
                  <div className="mt-3">
                    <span className="inline-block text-sm opacity-80">
                      {m.genres?.slice(0, 3).join(' • ')}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => ref.current?.scrollBy({ left: -by(), behavior: 'smooth' })}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-card/70 backdrop-blur-sm hover:bg-card p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => ref.current?.scrollBy({ left: by(), behavior: 'smooth' })}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-card/70 backdrop-blur-sm hover:bg-card p-1"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </section>
  );
};
