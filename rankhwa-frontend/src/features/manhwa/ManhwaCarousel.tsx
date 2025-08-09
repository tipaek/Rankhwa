import React, { useRef } from 'react';
import { ManhwaSummary } from '@/lib/api';
import { ManhwaCard } from './ManhwaCard';
import { Button } from '@/components/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ManhwaCarouselProps {
  title: string;
  items: ManhwaSummary[];
}

/**
 * A horizontal carousel for showcasing a list of manhwa.  Uses
 * overflow-x scroll under the hood with previous/next buttons for
 * keyboard accessibility.  When there are fewer than 5 items the
 * controls are hidden.
 */
export const ManhwaCarousel: React.FC<ManhwaCarouselProps> = ({ title, items }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = () => {
    const el = containerRef.current;
    if (!el) return 0;
    return el.clientWidth * 0.8;
  };
  const scrollLeft = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: -scrollBy(), behavior: 'smooth' });
  };
  const scrollRight = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: scrollBy(), behavior: 'smooth' });
  };
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 px-1">{title}</h2>
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-x-auto space-x-4 pb-2"
        >
          {items.map((item) => (
            <div key={item.id} className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] flex-shrink-0">
              <ManhwaCard manhwa={item} />
            </div>
          ))}
        </div>
        {items.length > 4 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/70 backdrop-blur-sm hover:bg-card p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-card/70 backdrop-blur-sm hover:bg-card p-1"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};