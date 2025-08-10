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
            const displayTitle =
              m.titleEnglish || m.titleRomaji || m.titleNative || m.title;
            const heroSrc = m.bannerUrl || m.coverUrl || '';
            return (
              <Link
                key={m.id}
                to={`/manhwa/${m.id}`}
                className="snap-start relative min-w-[85%] sm:min-w-[70%] lg:min-w-[90%] h-[280px] sm:h-[500px] overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={heroSrc}
                  alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* subtle base gradient to lift foreground */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent pointer-events-none"
                  aria-hidden
                />

                {/* glassy theme-colored backdrop for text */}
                <div className="absolute left-5 bottom-5 right-5">
                  <div className="inline-flex max-w-[min(95%,720px)] flex-col rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/60 p-4 shadow-md">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight line-clamp-2">
                      {displayTitle}
                    </h3>

                    {typeof m.avgRating === 'number' && (
                      <div className="mt-2 flex items-center space-x-2 text-sm">
                        <RatingStars rating={m.avgRating} />
                        <span className="font-medium">
                          {m.avgRating.toFixed(1)}
                        </span>
                        {m.voteCount != null && (
                          <span className="opacity-80">({m.voteCount})</span>
                        )}
                      </div>
                    )}

                    {!!m.genres?.length && (
                      <div className="mt-2 text-xs opacity-90 truncate">
                        {m.genres.slice(0, 3).join(' • ')}
                      </div>
                    )}
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
